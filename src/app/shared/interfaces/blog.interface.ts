export interface IBlogRequest {
    blogImage: string;
    blogTitle: string;
    publicationDate: string;
    blogCategory: string;
    blogText: string;
}

export interface IBlogResponse {
    id: string;
    blogImage: string;
    blogTitle: string;
    publicationDate: string;
    blogCategory: string;
    blogText: string;
}