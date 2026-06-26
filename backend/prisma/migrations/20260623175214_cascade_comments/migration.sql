-- DropForeignKey
ALTER TABLE "pmo_task_comments" DROP CONSTRAINT "pmo_task_comments_task_id_fkey";

-- AddForeignKey
ALTER TABLE "pmo_task_comments" ADD CONSTRAINT "pmo_task_comments_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "pmo_tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
