package com.databag

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

import android.os.Bundle;
import org.devio.rn.splashscreen.SplashScreen;

import org.unifiedpush.android.connector.UnifiedPush;

import android.content.Context;

import org.unifiedpush.android.connector.RegistrationDialogContent;

import android.content.Intent;

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Databag"

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent);
    setIntent(intent);
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    SplashScreen.show(this)
    super.onCreate(null)

    MainActivity activityContext = this;

    this.getSharedPreferences("unifiedpush.connector", Context.MODE_PRIVATE).edit().putBoolean("unifiedpush.no_distrib_dialog", true).apply();


    ReactInstanceManager mReactInstanceManager = getReactNativeHost().getReactInstanceManager();
        mReactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
            public void onReactContextInitialized(ReactContext validContext) {

              UnifiedPush.registerAppWithDialog(
                  activityContext,
                  "default",
                  new RegistrationDialogContent(),
                  new ArrayList<String>(),
                  getApplicationContext().getPackageName()
              );

            }
        });

  }

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
