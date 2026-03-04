import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useTasks } from '../hooks';

export function KanbanBoard() {
  const { tasks, updateTask } = useTasks();

  const statuses: string[] = ['new', 'in-progress', 'done'];

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (destination.droppableId !== source.droppableId) {
      updateTask(draggableId, { status: destination.droppableId as any });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4">
        {statuses.map(status => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                ref={provided.innerRef} 
                {...provided.droppableProps} 
                className="bg-gray-100 p-4 rounded flex-1 min-h-[300px]"
              >
                <h2 className="font-bold mb-2">{status.toUpperCase()}</h2>

                {tasks
                  .filter(task => task.status === status)
                  .map((task, index) => (
                    <Draggable draggableId={task.id} index={index} key={task.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef} 
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-3 rounded shadow mb-2"
                        >
                          {task.title}
                        </div>
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}