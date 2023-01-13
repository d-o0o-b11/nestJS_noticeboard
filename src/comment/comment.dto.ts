export class commentDTO {
  id: number;
  content: string;
  date: string;
}

export class UpdateCommentDTO {
  content?: string;
  date?: string;
}
