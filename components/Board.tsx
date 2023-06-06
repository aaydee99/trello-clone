'use client'
import { useBoardStore } from '@/store/BoardStore'
import { FC, useEffect } from 'react'
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd'
import { Column as ColumnType } from '@/typings'
import Column from './Column'

interface BoardProps {
}

const Board: FC<BoardProps> = ({ }) => {
  const [board, getBoard, setBoardState, updateTodoInDB] = useBoardStore((state) => [state.board, state.getBoard, state.setBoardState, state.updateTodoInDB])
  useEffect(() => {
    getBoard()
  }, [getBoard])

  const handleOnDragEnd = (result: DropResult) => {
    const {destination, source, type} = result;
    if(!destination) return

    if(type === 'column'){
      const entries = Array.from(board.columns.entries())
      const [removed] = entries.splice(source.index,1);
      entries.splice(destination.index, 0, removed);
      const rearrangedColumns = new Map(entries)
      setBoardState({...board, columns: rearrangedColumns})
    }

    const columns  = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const endColIndex = columns[Number(destination.droppableId)];

    const startCol: ColumnType = {
      id: startColIndex[0]!,
      todos: startColIndex[1].todos,
    }

    const endCol: ColumnType = {
      id: endColIndex[0],
      todos: endColIndex[1].todos,
    }
    if(!startCol || !endCol) return

    if(source.index === destination.index && startColIndex === endColIndex) return

    const newTodos = startCol.todos;
    const [todosMoved] = newTodos.splice(source.index, 1);
    if(startCol.id === endCol.id ) {
      newTodos.splice(destination.index, 0, todosMoved);
      const newCol={
        id: startCol.id,
        todos: newTodos,
      }
      const newColumns = new Map(board.columns)
      newColumns.set(startCol.id, newCol);
      setBoardState({...board, columns: newColumns});

    }else{
      const finishTodos = Array.from(endCol.todos);
      finishTodos.splice(destination.index, 0, todosMoved);

      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: newTodos,
      }

      newColumns.set(startCol.id, newCol);
      newColumns.set(endCol.id, {
        id: endCol.id,
        todos: finishTodos,
      });

      updateTodoInDB(todosMoved, endCol.id)
      setBoardState({...board, columns: newColumns});
    }
  }


  return (
    <DragDropContext onDragEnd={handleOnDragEnd} >
      <Droppable droppableId='board' direction='horizontal' type='column' >
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className='grid grid-cols-1 md:grid-cols-2 max-w-7xl mx-auto gap-5'>
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default Board