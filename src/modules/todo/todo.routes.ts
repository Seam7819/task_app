import { Router } from "express";
import { todoController } from "./todo.controller";

const router = Router()

router.post('/', todoController.createTodo);

router.get('/', todoController.getTodo);

router.get("/:id", todoController.getSingleTodo)

export const todoRouter = router;