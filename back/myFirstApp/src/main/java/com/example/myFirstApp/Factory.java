package com.example.myFirstApp;

public class Factory {
	 public shape createShape(String name) {
		  switch(name) {
		  case "line":
			  return new Line();
		  case "circle":
			  return new Circle();
		  case "triangle":
			  return new Triangle();
		  case "square":
			  return new Square();
		  case "rectangle":
			  return new Rectangle();
		  case "ellipse":
			  return new Ellipse();
		  }
		  return null;
	  }
}
