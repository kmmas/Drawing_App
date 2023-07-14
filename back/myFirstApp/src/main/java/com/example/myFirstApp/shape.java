package com.example.myFirstApp;

import org.springframework.stereotype.Component;

@Component
public class shape {
	private int _start_x;
    private int _start_y;
    private String _color;
    private String name;
    private int _LineWidth;
    private boolean _fill;
    private int radius;
    private int end_x;
    private int end_y;
    private int major_axis;
    private int minor_axis;
    private int side1;
    private int side2;
    private int width;
    private int length;
    public shape() {
    	
    }
	public shape(int _start_x, int _start_y, String _color, String name, int _LineWidth, boolean _fill, int radius,
			int end_x, int end_y, int major_axis, int minor_axis, int side1, int side2, int width, int length) {
		super();
		this._start_x = _start_x;
		this._start_y = _start_y;
		this._color = _color;
		this.name = name;
		this._LineWidth = _LineWidth;
		this._fill = _fill;
		this.radius = radius;
		this.end_x = end_x;
		this.end_y = end_y;
		this.major_axis = major_axis;
		this.minor_axis = minor_axis;
		this.side1 = side1;
		this.side2 = side2;
		this.width = width;
		this.length = length;
	}
	public int get_start_x() {
		return _start_x;
	}
	public void set_start_x(int _start_x) {
		this._start_x = _start_x;
	}
	public int get_start_y() {
		return _start_y;
	}
	public void set_start_y(int _start_y) {
		this._start_y = _start_y;
	}
	public String get_color() {
		return _color;
	}
	public void set_color(String _color) {
		this._color = _color;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int get_LineWidth() {
		return _LineWidth;
	}
	public void set_LineWidth(int _LineWidth) {
		this._LineWidth = _LineWidth;
	}
	public boolean is_fill() {
		return _fill;
	}
	public void set_fill(boolean _fill) {
		this._fill = _fill;
	}
	public int getRadius() {
		return radius;
	}
	public void setRadius(int radius) {
		this.radius = radius;
	}
	public int getEnd_x() {
		return end_x;
	}
	public void setEnd_x(int end_x) {
		this.end_x = end_x;
	}
	public int getEnd_y() {
		return end_y;
	}
	public void setEnd_y(int end_y) {
		this.end_y = end_y;
	}
	public int getMajor_axis() {
		return major_axis;
	}
	public void setMajor_axis(int major_axis) {
		this.major_axis = major_axis;
	}
	public int getMinor_axis() {
		return minor_axis;
	}
	public void setMinor_axis(int minor_axis) {
		this.minor_axis = minor_axis;
	}
	public int getSide1() {
		return side1;
	}
	public void setSide1(int side1) {
		this.side1 = side1;
	}
	public int getSide2() {
		return side2;
	}
	public void setSide2(int side2) {
		this.side2 = side2;
	}
	public int getWidth() {
		return width;
	}
	public void setWidth(int width) {
		this.width = width;
	}
	public int getLength() {
		return length;
	}
	public void setLength(int length) {
		this.length = length;
	}
	
	
	
    
}
