interface ChatRoomBase {
	id: string;
	isPrivate: boolean;
	password?: string;
	owner?: string;
}

export interface CreateChatRoom extends ChatRoomBase {
	timestamp: object;
}

export interface ChatRoom extends ChatRoomBase {
	timestamp: number;
}
