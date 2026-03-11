import mongoose, { Schema } from "mongoose";

const subTodoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      Enum: ["Completed", "Pending", "InProgress"],
      default: "Pending",
    },
    maintodoid: {
      type: Schema.Types.ObjectId,
      ref: "MainTodo",
    },
  },
  { timestamps: true }
);

export const SubTodo = mongoose.model("SubTodo", subTodoSchema);
