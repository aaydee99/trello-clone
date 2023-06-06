import getUrl from '@/lib/getUrl';
import { useBoardStore } from '@/store/BoardStore';
import { Todo, TypedColumn } from '@/typings'
import { XCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react'
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from 'react-beautiful-dnd';

interface TodoCardProps {
    todo: Todo;
    index: number;
    id: TypedColumn
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: DraggableProvidedDraggableProps;
    dragHandleProps: DraggableProvidedDragHandleProps;
}

const TodoCard: FC<TodoCardProps> = ({ dragHandleProps, draggableProps, id, index, innerRef, todo }) => {
    const deleteTask = useBoardStore((state) => state.deleteTask)
    const [image, setImage] = useState<string | null>(null)

    useEffect(() => {
        if (todo.image) {
            const fetchImage = async () => {
                const url = await getUrl(todo.image!);
                if (url) {
                    setImage(url.toString());
                }
            }
            fetchImage();
        }
    }, [todo])
    return <div {...draggableProps} {...dragHandleProps} className='bg-white rounded-md space-y-2 drop-shadow-sm' ref={innerRef}>
        <div className='flex justify-between items-center p-5'>
            <p>{todo.title}</p>
            <button className='text-red-500 hover:text-red-600' title="Close" onClick={() => {
                deleteTask(index, todo, id)
            }} >
                <XCircleIcon className='ml-5 h-8 w-8' />
            </button>
        </div>

        {image && (
            <div className='relative h-full w-full rounded-b-md '>
                <Image src={image} alt={"taskImage"} width={400} height={200} className='w-full object-contain rounded-b-md' />
            </div>
        )}
    </div>
}

export default TodoCard