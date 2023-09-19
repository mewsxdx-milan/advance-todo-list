import {
  Button,
  Card,
  Container,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

function SortableItem({ title, index, parent }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: title,
    data: {
      title,
      index,
      parent,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      key={title}
    >
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 1,
          backgroundColor: parent === "Done" ? "lightgreen" : "default",
        }}
        elevation={4}
      >
        <Grid
          display={"flex"}
          flex={1}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography>{title}</Typography>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Card>
    </div>
  );
}

function SortablePanel({ title, items }) {
  const { setNodeRef } = useDroppable({
    id: title,
  });
  return (
    <Grid>
      <Typography variant="h6" paddingY={2}>
        {title}
      </Typography>
      <Divider variant="middle"></Divider>
      <Grid
        ref={setNodeRef}
        backgroundColor="gray.200"
        borderRadius="8"
        flex={1}
        padding={2}
        display={"flex"}
        gap={2}
        flexDirection="column"
      >
        {items && items.length > 0 ? (
          items.map(({ title: cardTitle }, key) => (
            <SortableItem
              title={cardTitle}
              key={key}
              index={key}
              parent={title}
            />
          ))
        ) : (
          <Typography>Nothing Here</Typography>
        )}
      </Grid>
    </Grid>
  );
}

const Todo = () => {
  const inputRef = useRef();
  const [todo, setTodo] = useState([]);
  const [value, setValue] = useState("");
  const [completedtodo, setCompletedTodo] = useState([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleAdd = () => {
    setTodo([...todo, { title: value }]);
    setValue("");
  };

  useEffect(() => {}, [Todo]);

  console.log(completedtodo, todo);
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={(e) => handleDragEnd(e)}
      modifiers={[restrictToHorizontalAxis]}
    >
      <Container>
        <Grid
          bgcolor={"#EAEAEB"}
          padding={3}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={3}
        >
          <TextField
            sx={{ width: 500 }}
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <Button variant="contained" onClick={handleAdd} disabled={!value}>
            Add Todo
          </Button>
        </Grid>
        <Typography variant="h5" paddingTop={1}>
          Drag to Move in Done & Click to Delete
        </Typography>
        <Grid
          marginY={4}
          bgcolor={"#C4D4C8"}
          display={"flex"}
          flexDirection={"row"}
          borderRadius={2}
        >
          <Grid display={"flex"} flex={1} height={500} flexDirection={"column"}>
            <SortablePanel title={"Todo"} items={todo} />
          </Grid>
          <Divider orientation="vertical" flexItem variant="middle" />
          <Grid display={"flex"} flex={1} height={500}>
            <Grid width={"100%"}>
              <SortablePanel title={"Done"} items={completedtodo} />
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </DndContext>
  );
  function handleDragEnd(e) {
    const container = e.over?.id;
    const title = e.active.data.current?.title ?? "";
    const index = e.active.data.current?.index ?? 0;
    const parent = e.active.data.current?.parent ?? "ToDo";
    if (container === "Todo") {
      setTodo([...todo, { title }]);
    } else if (container === "Done") {
      setCompletedTodo([...completedtodo, { title }]);
    }
    if (parent === "Todo") {
      setTodo([...todo.slice(0, index), ...todo.slice(index + 1)]);
    } else if (parent === "Done") {
      setCompletedTodo([
        ...completedtodo.slice(0, index),
        ...completedtodo.slice(index + 1),
      ]);
    }
  }
};

export default Todo;
