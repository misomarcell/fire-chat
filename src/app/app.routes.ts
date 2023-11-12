import { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "",
		redirectTo: "home",
		pathMatch: "full",
	},
	{
		path: "home",
		loadComponent: () => import("./home/home.component").then((m) => m.HomeComponent),
	},
	{
		path: "chat/:id",
		loadComponent: () => import("./message-board/message-board.component").then((m) => m.MessageBoardComponent),
	},
];
