export interface Post {
    _id: string;
    title: string;
    content: string;
    author: {
      profile: any; username: string, avatar: string 
};
}
