import React, { useEffect, useRef, useState, MouseEvent } from "react";
import { Container, StyledCanvas } from "pages/Canvas/styled";

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  selected: boolean;
}

interface Circle {
  x: number;
  y: number;
  radius: number;
  selected: boolean;
}

type Shape = Rectangle | Circle;

const CanvasPage = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [shapes, setShapes] = useState<Shape[]>([
    { x: 50, y: 60, width: 100, height: 100, selected: false }, // Rectangle
    { x: 200, y: 100, radius: 50, selected: false }, // Circle
  ]);
  const [dragging, setDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const drawShapes = (ctx: CanvasRenderingContext2D) => {
    if (canvasRef.current) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      shapes.forEach((shape) => {
        if ("width" in shape) {
          drawRect(ctx, shape as Rectangle);
        } else {
          drawCircle(ctx, shape as Circle);
        }
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        drawShapes(ctx);
      }
    }
  }, [shapes]);

  const drawRect = (ctx: CanvasRenderingContext2D, shape: Rectangle) => {
    ctx.beginPath();
    ctx.rect(shape.x, shape.y, shape.width, shape.height);
    ctx.fillStyle = shape.selected ? "blue" : "green";
    ctx.fill();
    ctx.closePath();
  };

  const drawCircle = (ctx: CanvasRenderingContext2D, shape: Circle) => {
    ctx.beginPath();
    ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
    ctx.fillStyle = shape.selected ? "blue" : "green";
    ctx.fill();
    ctx.closePath();
  };

  const getMousePosition = (event: MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  const handleMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    const mousePos = getMousePosition(event);
    shapes.forEach((shape, index) => {
      if ("width" in shape) {
        if (
          mousePos.x > shape.x &&
          mousePos.x < shape.x + shape.width &&
          mousePos.y > shape.y &&
          mousePos.y < shape.y + shape.height
        ) {
          selectShape(index, mousePos);
        }
      } else if ("radius" in shape) {
        const dist = Math.sqrt(
          (mousePos.x - shape.x) ** 2 + (mousePos.y - shape.y) ** 2,
        );
        if (dist < shape.radius) {
          selectShape(index, mousePos);
        }
      }
    });
  };

  const selectShape = (index: number, mousePos: { x: number; y: number }) => {
    const selectedShape = shapes[index];
    setDragIndex(index);
    setDragging(true);
    setDragOffset({
      x: mousePos.x - selectedShape.x,
      y:
        mousePos.y -
        ("radius" in selectedShape ? selectedShape.y : selectedShape.y),
    });
    setShapes(
      shapes.map((shape, i) =>
        i === index ? { ...shape, selected: !shape.selected } : shape,
      ),
    );
  };

  const handleMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    if (dragging && dragIndex !== null) {
      const mousePos = getMousePosition(event);
      const updatedShapes = [...shapes];
      const draggedShape = updatedShapes[dragIndex];

      if ("width" in draggedShape) {
        draggedShape.x = mousePos.x - dragOffset.x;
        draggedShape.y = mousePos.y - dragOffset.y;
      } else if ("radius" in draggedShape) {
        draggedShape.x = mousePos.x - dragOffset.x;
        draggedShape.y = mousePos.y - dragOffset.y;
      }

      setShapes(updatedShapes);
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setDragIndex(null);
  };

  return (
    <Container>
      <StyledCanvas
        ref={canvasRef}
        width={500}
        height={500}
        style={{}}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </Container>
  );
};

export default CanvasPage;
