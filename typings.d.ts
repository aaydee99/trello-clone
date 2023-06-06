import { Interface } from "readline";

interface Board {
  columns: Map<TypedColumn, Column>;
}

type TypedColumn = "todos" | "inprogress" | "done";

interface Column {
  id: TypedColumn;
  todos: Todo[];
}

interface Todo extends Models.Document {
  $id: string;
  $createdAt: string;
  title: string;
  status: string;
  image?: image;
}

interface image {
  bucketId: string;
  fileId: string;
}
