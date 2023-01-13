export interface NoticeBoardDTO {
  id: number;
  title: string;
  content: string;
  date: string;
  view: number;
}

export interface UpdateNoticeBoardDTO {
  title?: string;

  content?: string;

  date?: string;

  view?: number;
}
