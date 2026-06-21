package com.chaitap.challenge

import android.annotation.SuppressLint
import android.app.AlertDialog
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import android.view.WindowManager
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var splashContainer: FrameLayout

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Lock screen orientation to Portrait programmatically
        requestedOrientation = android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT

        // Keep screen awake while game is active
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)

        // Make window layout stretch fully behind system cuts
        WindowCompat.setDecorFitsSystemWindows(window, false)

        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        splashContainer = findViewById(R.id.splashContainer)

        // Hide full Status Bars and UI controls
        hideSystemUI()

        // Configure WebView settings to run production web games safely
        configureWebView()

        // Setup custom back navigation behaviour (Required for modern Android API 33/34 back gestures)
        setupBackNavigation()

        // Start loading the bundled offline assets
        webView.loadUrl("file:///android_asset/index.html")

        // Display beautiful native splash frame for exactly 2 seconds, then fade out
        Handler(Looper.getMainLooper()).postDelayed({
            fadeAndRemoveSplash()
        }, 2000)
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) {
            hideSystemUI()
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configureWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            loadsImagesAutomatically = true
            mediaPlaybackRequiresUserGesture = false
            useWideViewPort = true
            loadWithOverviewMode = true
        }

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                // Page loaded successfully
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            // Can be extended to support custom JavaScript console logs, geo, alerts etc.
        }
    }

    private fun hideSystemUI() {
        WindowInsetsControllerCompat(window, window.decorView).apply {
            hide(WindowInsetsCompat.Type.systemBars())
            systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        }
    }

    private fun setupBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    showExitConfirmationDialog()
                }
            }
        })
    }

    private fun showExitConfirmationDialog() {
        AlertDialog.Builder(this)
            .setIcon(android.R.drawable.ic_dialog_alert)
            .setTitle("Exit Game?")
            .setMessage("Leaving already? Dolly is about to pour a warm, steaming cutting cup! Are you sure you want to exit?")
            .setPositiveButton("Yes") { _, _ ->
                finish() // Closes and exits the app
            }
            .setNegativeButton("No") { dialog, _ ->
                dialog.dismiss()
                hideSystemUI() // Restore immersive fullscreen
            }
            .setCancelable(true)
            .show()
    }

    private fun fadeAndRemoveSplash() {
        splashContainer.animate()
            .alpha(0f)
            .setDuration(400)
            .withEndAction {
                splashContainer.visibility = View.GONE
            }
            .start()
    }
}
