package com.vintamie.app

import android.annotation.SuppressLint
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.webkit.*
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.FileProvider
import com.google.android.material.floatingactionbutton.ExtendedFloatingActionButton
import okhttp3.*
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream
import java.io.IOException

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var fabFill: ExtendedFloatingActionButton
    
    // Server addresses (10.0.2.2 is the standard emulator gateway to localhost)
    private val frontendUrl = "http://10.0.2.2:5173"
    private val backendUrl = "http://10.0.2.2:8000"

    private var activeDraftJson: String? = null
    private var activeImageUri: Uri? = null
    private var activePlatform: String? = null

    private val okHttpClient = OkHttpClient()

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        fabFill = findViewById(R.id.fabFill)

        // Configure WebView settings
        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.databaseEnabled = true
        
        // Use a standard mobile Chrome user agent to prevent Cloudflare/Vinted bot-blocking
        settings.userAgentString = "Mozilla/5.0 (Linux; Android 13; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36"

        // Register JS interface
        webView.addJavascriptInterface(VintamieBridge(), "VintamieBridge")

        // Setup WebViewClient
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                // Keep navigation within the WebView
                return false
            }

            override fun onPageFinished(view: WebView, url: String) {
                super.onPageFinished(view, url)
                
                // Show or hide the FAB based on the current URL
                if (url.contains("vinted.de/items/new") || 
                    url.contains("vinted.fr/items/new") ||
                    url.contains("kleinanzeigen.de/p-anzeige-aufgeben.html")
                ) {
                    if (activeDraftJson != null) {
                        fabFill.visibility = View.VISIBLE
                    }
                } else {
                    fabFill.visibility = View.GONE
                }
            }
        }

        // Setup WebChromeClient to handle automatic image upload injection
        webView.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(
                webView: WebView,
                filePathCallback: ValueCallback<Array<Uri>>,
                fileChooserParams: FileChooserParams
            ): Boolean {
                // Intercept file chooser and supply the draft photo programmatically
                activeImageUri?.let { uri ->
                    filePathCallback.onReceiveValue(arrayOf(uri))
                    // Clear the URI so next file chooser clicks can open standard dialog
                    activeImageUri = null
                    Toast.makeText(this@MainActivity, "Foto automatisch hochgeladen!", Toast.LENGTH_SHORT).show()
                    return true
                }
                
                // If no active photo, return false to let default file picker run
                return false
            }
        }

        // Configure floating fill action button
        fabFill.setOnClickListener {
            injectAutofillScript()
        }

        // Load the frontend dashboard
        webView.loadUrl(frontendUrl)
    }

    // Javascript Interface definition
    inner class VintamieBridge {
        @JavascriptInterface
        fun postToPlatform(draftId: Int, platform: String, token: String) {
            runOnUiThread {
                Toast.makeText(this@MainActivity, "Lade Entwurf #$draftId...", Toast.LENGTH_SHORT).show()
                fetchDraftAndPrepare(draftId, platform, token)
            }
        }
    }

    // Fetch draft metadata and photo from local backend
    private fun fetchDraftAndPrepare(draftId: Int, platform: String, token: String) {
        val request = Request.Builder()
            .url("$backendUrl/api/drafts/$draftId")
            .header("Authorization", "Bearer $token")
            .build()

        okHttpClient.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    Toast.makeText(this@MainActivity, "Serververbindung fehlgeschlagen: ${e.message}", Toast.LENGTH_LONG).show()
                }
            }

            override fun onResponse(call: Call, response: Response) {
                response.use {
                    if (!response.isSuccessful) {
                        runOnUiThread {
                            Toast.makeText(this@MainActivity, "Fehler beim Laden des Entwurfs.", Toast.LENGTH_LONG).show()
                        }
                        return
                    }
                    
                    val bodyString = response.body?.string() ?: return
                    val json = JSONObject(bodyString)
                    val imagePath = json.optString("image_path")

                    activeDraftJson = bodyString
                    activePlatform = platform

                    if (imagePath.isNotEmpty()) {
                        downloadImageAndNavigate(imagePath, platform)
                    } else {
                        runOnUiThread {
                            activeImageUri = null
                            navigateToPlatformListing(platform)
                        }
                    }
                }
            }
        })
    }

    // Download the draft photo to temporary cache dir and generate shareable content:// URI
    private fun downloadImageAndNavigate(imagePath: String, platform: String) {
        val url = if (imagePath.startsWith("http")) imagePath else "$backendUrl$imagePath"
        
        val request = Request.Builder().url(url).build()
        okHttpClient.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                runOnUiThread {
                    Toast.makeText(this@MainActivity, "Bild konnte nicht geladen werden.", Toast.LENGTH_SHORT).show()
                    navigateToPlatformListing(platform)
                }
            }

            override fun onResponse(call: Call, response: Response) {
                response.use {
                    if (!response.isSuccessful) {
                        runOnUiThread { navigateToPlatformListing(platform) }
                        return
                    }

                    try {
                        val cacheFile = File(cacheDir, "vintamie_upload.jpg")
                        val fos = FileOutputStream(cacheFile)
                        fos.write(response.body?.bytes() ?: byteArrayOf())
                        fos.close()

                        // Get FileProvider URI
                        val fileUri = FileProvider.getUriForFile(
                            this@MainActivity,
                            "com.vintamie.app.fileprovider",
                            cacheFile
                        )

                        runOnUiThread {
                            activeImageUri = fileUri
                            navigateToPlatformListing(platform)
                        }
                    } catch (e: Exception) {
                        runOnUiThread {
                            Toast.makeText(this@MainActivity, "Fehler beim Speichern des Bildes: ${e.message}", Toast.LENGTH_LONG).show()
                            navigateToPlatformListing(platform)
                        }
                    }
                }
            }
        })
    }

    private fun navigateToPlatformListing(platform: String) {
        val url = if (platform == "vinted") {
            "https://www.vinted.de/items/new"
        } else {
            "https://www.kleinanzeigen.de/p-anzeige-aufgeben.html"
        }
        webView.loadUrl(url)
    }

    // Injects Javascript to autofill fields and trigger the file upload chooser click
    private fun injectAutofillScript() {
        val draftJson = activeDraftJson ?: return
        val escapedJson = draftJson.replace("'", "\\'")

        val js = """
            (function() {
                const draft = JSON.parse('$escapedJson');
                const isVinted = window.location.hostname.includes('vinted');
                
                if (isVinted) {
                    // Vinted Form Filling
                    const title = document.querySelector("input[name='title']") || document.querySelector("input[placeholder*='titel']") || document.querySelector("input[id*='title']");
                    if (title) { title.value = draft.title; title.dispatchEvent(new Event('input', { bubbles: true })); }
                    
                    const desc = document.querySelector("textarea[name='description']") || document.querySelector("textarea[placeholder*='beschreib']") || document.querySelector("textarea[id*='desc']");
                    if (desc) { desc.value = draft.description; desc.dispatchEvent(new Event('input', { bubbles: true })); }
                    
                    const price = document.querySelector("input[name='price']") || document.querySelector("input[placeholder*='0,00']") || document.querySelector("input[id*='price']");
                    if (price) { price.value = Math.round(draft.price); price.dispatchEvent(new Event('input', { bubbles: true })); }
                    
                    // Click file upload element to trigger onShowFileChooser
                    const fileInput = document.querySelector("input[type='file']");
                    if (fileInput) {
                        fileInput.click();
                    }
                } else {
                    // Kleinanzeigen Form Filling
                    const title = document.querySelector("#postad-title") || document.querySelector("input[name='title']");
                    if (title) { title.value = draft.title; title.dispatchEvent(new Event('input', { bubbles: true })); }
                    
                    const desc = document.querySelector("#pstad-descrptn") || document.querySelector("textarea[name='description']");
                    if (desc) { desc.value = draft.description; desc.dispatchEvent(new Event('input', { bubbles: true })); }
                    
                    const price = document.querySelector("#pstad-price") || document.querySelector("input[name='price']");
                    if (price) { price.value = Math.round(draft.price); price.dispatchEvent(new Event('input', { bubbles: true })); }
                    
                    const priceRadios = document.querySelectorAll("input[name='priceType']");
                    if (priceRadios) {
                        for (let radio of priceRadios) {
                            if (radio.value === "FIXED") {
                                radio.checked = true;
                                radio.dispatchEvent(new Event('change', { bubbles: true }));
                                break;
                            }
                        }
                    }
                    
                    // Trigger image input click
                    const fileInput = document.querySelector("input[type='file']");
                    if (fileInput) {
                        fileInput.click();
                    }
                }
            })();
        """.trimIndent()

        webView.evaluateJavascript(js, null)
        
        // Hide FAB after filling
        fabFill.visibility = View.GONE
        activeDraftJson = null
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
