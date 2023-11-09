import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import {
	getAnalytics,
	provideAnalytics,
	ScreenTrackingService,
	UserTrackingService,
} from "@angular/fire/analytics";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { getDatabase, provideDatabase } from "@angular/fire/database";
import { getFunctions, provideFunctions } from "@angular/fire/functions";
import { getPerformance, providePerformance } from "@angular/fire/performance";
import { provideClientHydration } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideClientHydration(),
		importProvidersFrom(
			provideFirebaseApp(() =>
				initializeApp({
					projectId: "marcell-fire-chat",
					appId: "1:458117046067:web:fdbe93b2040358d2f8a846",
					databaseURL:
						"https://marcell-fire-chat-default-rtdb.europe-west1.firebasedatabase.app",
					storageBucket: "marcell-fire-chat.appspot.com",
					apiKey: "AIzaSyAnpfnTbQzmU3Ms7fviLZb8Rmj_n3ad8BU",
					authDomain: "marcell-fire-chat.firebaseapp.com",
					messagingSenderId: "458117046067",
				})
			)
		),
		importProvidersFrom(provideAuth(() => getAuth())),
		importProvidersFrom(provideAnalytics(() => getAnalytics())),
		ScreenTrackingService,
		UserTrackingService,
		importProvidersFrom(provideDatabase(() => getDatabase())),
		importProvidersFrom(provideFunctions(() => getFunctions())),
		importProvidersFrom(providePerformance(() => getPerformance())),
	],
};
