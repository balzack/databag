package com.databag;

import android.content.Context;
import org.jetbrains.annotations.NotNull;
import org.unifiedpush.android.connector.MessagingReceiver;
import android.util.Log;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;

import android.app.ActivityManager.RunningAppProcessInfo;
import android.app.ActivityManager;
import android.os.Build;
import android.net.Uri;
import android.media.RingtoneManager;
import androidx.core.app.NotificationCompat;
import java.nio.charset.StandardCharsets;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class CustomReceiver extends MessagingReceiver {
    public CustomReceiver() {
        super();
    }

    private boolean forgrounded () {
      ActivityManager.RunningAppProcessInfo appProcessInfo = new ActivityManager.RunningAppProcessInfo();
      ActivityManager.getMyMemoryState(appProcessInfo);
      return (appProcessInfo.importance == RunningAppProcessInfo.IMPORTANCE_FOREGROUND || appProcessInfo.importance == RunningAppProcessInfo.IMPORTANCE_VISIBLE);
    }

    @Override
    public void onNewEndpoint(@NotNull Context context, @NotNull String endpoint, @NotNull String instance) {

      final ReactInstanceManager reactInstanceManager =
                ((ReactApplication) context.getApplicationContext())
                    .getReactNativeHost()
                    .getReactInstanceManager();
            ReactContext reactContext = reactInstanceManager.getCurrentReactContext();

    WritableMap params = Arguments.createMap();
    params.putString("instance", instance);
    params.putString("endpoint", endpoint);
    reactContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit("unifiedPushURL", params);

        // Called when a new endpoint be used for sending push messages
    }

    @Override
    public void onRegistrationFailed(@NotNull Context context, @NotNull String instance) {
        // called when the registration is not possible, eg. no network
    }

    @Override
    public void onUnregistered(@NotNull Context context, @NotNull String instance) {
        // called when this application is unregistered from receiving push messages
    }

    @Override
    public void onMessage(@NotNull Context context, @NotNull byte[] message, @NotNull String instance) {

      if (forgrounded()) {
        return;
      }

      String strMessage = new String(message, StandardCharsets.UTF_8);


        Intent intent = new Intent(context, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0 /* Request code */, intent,
                                                                PendingIntent.FLAG_IMMUTABLE);

        String channelId = "fcm_default_channel";
        Uri defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(context,
                                                                                        channelId)
        .setSmallIcon(R.mipmap.ic_launcher)
        .setContentTitle(strMessage).setAutoCancel(true).setSound(
                defaultSoundUri).setContentIntent(pendingIntent);

        NotificationManager notificationManager = (NotificationManager) context.getSystemService(
                Context.NOTIFICATION_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(channelId, "Channel human readable title",
                                                                  NotificationManager.IMPORTANCE_DEFAULT);
            notificationManager.createNotificationChannel(channel);
        }

        notificationManager.notify(0, notificationBuilder.build());
    }
}

