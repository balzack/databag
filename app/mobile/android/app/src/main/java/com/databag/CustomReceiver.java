package com.databag;

import android.content.Context;
import org.jetbrains.annotations.NotNull;
import org.unifiedpush.android.connector.MessagingReceiver;

public class CustomReceiver extends MessagingReceiver {
    public CustomReceiver() {
        super();
    }
    @Override
    public void onNewEndpoint(@NotNull Context context, @NotNull String endpoint, @NotNull String instance) {
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
        // Called when a new message is received. The message contains the full POST body of the push message
    }
}

