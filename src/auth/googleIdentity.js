import { ApiError } from "@/api/errors";
import { GOOGLE_IDENTITY_SCRIPT } from "@/constants/google";

let loading = null;
let handleCredential = () => {};

export function loadGoogleIdentity(clientId) {
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = GOOGLE_IDENTITY_SCRIPT;
    script.async = true;

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: ({ credential }) => handleCredential(credential),
        ux_mode: "popup",
      });
      resolve(window.google.accounts.id);
    };

    script.onerror = () => {
      loading = null;
      script.remove();
      reject(new ApiError(0, "GOOGLE_IDENTITY_UNAVAILABLE"));
    };

    document.head.append(script);
  });

  return loading;
}

export function onGoogleCredential(handler) {
  handleCredential = handler;
  return () => {
    if (handleCredential === handler) handleCredential = () => {};
  };
}
