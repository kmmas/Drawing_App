import { ellipse } from './shapes/ellipse';
import { rect } from './shapes/rect';
import { line } from './shapes/line';
import { square } from './shapes/square';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { operation } from './operation';
import { shape } from './shape';
import { ShapeFactory } from './ShapeFactory';
import { circle } from './shapes/circle';
import { triangle } from './shapes/triangle';
import { PaintService } from './paint.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  constructor(private paintsrvs: PaintService){
  }
  @ViewChild('drawboard', { static: true }) mycanvas!: ElementRef;

  title = 'paint';
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  StartedDrawing: boolean = false;
  Drawed: boolean = false;
  ShapeMoved: boolean = false;
  CurrentTool: string = 'select from Shapes';
  start_x!: number;
  start_y!: number;
  snapshot!: ImageData;
  display: boolean = true;
  OurFactory: ShapeFactory = new ShapeFactory();

  color: string = '#000000';
  size: number = 1;
  fill: boolean = false;

  AllShapes: shape[] = [];
  loadedShapes:any[]=[];
  foundAt!: number;
  ShapeWasSelected: boolean = false;
  SelectedShape!: shape;
  CopiedShape!: shape;
  ShapeWasCopied: boolean = false;
  CurrentMode: string = 'Draw';
  sizing: number = 1;
  ResizingEnabled: boolean = false;
  OperationsToUndo: operation[] = [];
  OperationsToRedo: operation[] = [];

  ngAfterViewInit(): void {
    this.canvas = this.mycanvas.nativeElement;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!;
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  update() {
    this.AllShapes[this.foundAt].resize(this.sizing);
    this.Draw_AllShapes();
    this.AllShapes[this.foundAt] = this.SelectedShape.clone();
  }
  change() {
    this.AllShapes[this.foundAt].resize(this.sizing);
    this.OperationsToUndo.push(new operation('replace', this.foundAt, this.SelectedShape));
    this.OperationsToRedo.splice(0);
    this.ResizingEnabled = false;
    this.sizing = 1;
  }

  SelectTool(x: string) {
    this.CurrentTool = x;
    this.CurrentMode = 'Draw';
    this.canvas.style.cursor = 'crosshair';
    this.display = true;
    this.ResizingEnabled = false;
  }

  SelectMode(x: string) {
    this.CurrentMode = x;
    this.display = false;
    this.ResizingEnabled = false;
    this.canvas.style.cursor = 'default';
  }

  undo() {
    if (this.OperationsToUndo.length === 0) {
      alert('nothing to undo');
      return;
    }
    console.log('redo berfore', this.OperationsToRedo);
    let x = this.OperationsToUndo.pop()!;
    let tmp: shape;
    switch (x.name) {
      case 'draw':
        this.AllShapes.pop();
        this.Draw_AllShapes();
        break;
      case 'replace':
        tmp = this.AllShapes[x.index].clone();
        this.AllShapes[x.index] = x.target.clone();
        x.target = tmp.clone();
        this.Draw_AllShapes();
        break;
      case 'delete':
        this.AllShapes.splice(x.index, 0, x.target.clone());
        this.Draw_AllShapes();
        break;
    }
    this.OperationsToRedo.push(x);
    console.log('redo after', this.OperationsToRedo);
  }

  redo() {
    if (this.OperationsToRedo.length === 0) {
      alert('nothing to redo');
      return;
    }
    let x = this.OperationsToRedo.pop()!;
    let tmp: shape;
    switch (x.name) {
      case 'draw':
        this.AllShapes.push(x.target.clone());
        this.Draw_AllShapes();
        break;
      case 'replace':
        tmp = this.AllShapes[x.index].clone();
        this.AllShapes[x.index] = x.target.clone();
        x.target = tmp.clone();
        this.Draw_AllShapes();
        break;
      case 'delete':
        this.AllShapes.splice(x.index, 1);
        this.Draw_AllShapes();
        break;
    }
    this.OperationsToUndo.push(x);
  }

  Select_Shape(x: number, y: number) {
    for (let index = 0; index < this.AllShapes.length; index++) {
      if (this.AllShapes[index].mouse_is_in_shape(x, y)) {
        this.ShapeWasSelected = true;
        this.start_x = x;
        this.start_y = y;
        this.foundAt = index;
        this.SelectedShape = this.AllShapes[index].clone();
        this.canvas.style.cursor = 'grab';
        console.log("selected shape");
        //return;
      }
    }
  }

  Draw_AllShapes() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let index = 0; index < this.AllShapes.length; index++) {
      this.AllShapes[index].draw_shape(this.ctx);
    }
  }
  Move_Shape(x: number, y: number) {
    this.canvas.style.cursor = 'grabbing';
    this.AllShapes[this.foundAt].Move_shape(this.start_x, this.start_y, x, y);
    this.Draw_AllShapes();
    this.start_x = x;
    this.start_y = y;
  }

  onmousedown(event: MouseEvent) {
    if (this.CurrentMode === 'move' || this.CurrentMode === 'delete' || this.CurrentMode === 'copy' || this.CurrentMode === 'resize') {
      this.Select_Shape(event.offsetX, event.offsetY);
      return;
    }
    if (this.CurrentMode === 'paste') {
      this.start_x = event.offsetX;
      this.start_y = event.offsetY;
      return;
    }
    if (this.CurrentMode === 'Draw' && this.CurrentTool !== 'select from Shapes') {
      this.StartedDrawing = true;
      this.ctx.strokeStyle = this.color;
      this.ctx.fillStyle = this.color;
      this.ctx.lineWidth = this.size;
      this.ctx.beginPath();
      this.start_x = event.offsetX;
      this.start_y = event.offsetY;
      this.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
      return;
    }
  }

  onmousemove(event: MouseEvent) {
    if (this.ShapeWasSelected && this.CurrentMode === 'move') {
      this.ShapeMoved = true;
      this.Move_Shape(event.offsetX, event.offsetY);
      return;
    }
    //the following will only happen when CurrentMode 'Draw'
    if (!this.StartedDrawing) {
      return;
    }
    this.Drawed = true;
    this.ctx.putImageData(this.snapshot, 0, 0);
    switch (this.CurrentTool) {
      case 'line':
        this.ctx.beginPath();
        this.ctx.moveTo(this.start_x, this.start_y);
        this.ctx.lineTo(event.offsetX, event.offsetY);
        this.ctx.stroke();
        this.ctx.closePath();
        break;
      case 'rect':
        if (this.fill) {
          this.ctx.fillRect(this.start_x, this.start_y, event.offsetX - this.start_x, event.offsetY - this.start_y);
        } else {
          this.ctx.strokeRect(this.start_x, this.start_y, event.offsetX - this.start_x, event.offsetY - this.start_y);
        }
        break;
      case 'circle':
        this.ctx.beginPath();
        let radius = Math.sqrt(Math.pow(this.start_x - event.offsetX, 2) + Math.pow(this.start_y - event.offsetY, 2));
        this.ctx.arc(this.start_x, this.start_y, radius, 0, 2 * Math.PI);
        this.fill ? this.ctx.fill() : this.ctx.stroke();
        this.ctx.closePath();
        break;
      case 'ellipse':
        this.ctx.beginPath();
        this.ctx.ellipse(this.start_x, this.start_y, Math.abs(this.start_x - event.offsetX), Math.abs(this.start_y - event.offsetY), 0, 0, 2 * Math.PI);
        this.fill ? this.ctx.fill() : this.ctx.stroke();
        this.ctx.closePath();
        break;
      case 'square':
        let side = event.offsetX - this.start_x;
        if (this.fill) {
          this.ctx.fillRect(this.start_x, this.start_y, side, Math.sign(event.offsetY - this.start_y) * Math.abs(side));
        } else {
          this.ctx.strokeRect(this.start_x, this.start_y, side, Math.sign(event.offsetY - this.start_y) * Math.abs(side));
        }
        break;
      case 'triangle':
        this.ctx.beginPath();
        this.ctx.moveTo(this.start_x, this.start_y);
        this.ctx.lineTo(event.offsetX, event.offsetY);
        this.ctx.lineTo(this.start_x * 2 - event.offsetX, event.offsetY);
        this.ctx.closePath();
        this.fill ? this.ctx.fill() : this.ctx.stroke();
        break;
    }
  }

  onmouseup(event: MouseEvent) {
    if (this.CurrentMode === 'move' || this.CurrentMode === 'delete' || this.CurrentMode === 'copy' || this.CurrentMode === 'resize') {
      this.canvas.style.cursor = 'default';
    }
    if (this.CurrentMode === 'copy' && this.ShapeWasSelected) {
      this.CopiedShape = this.SelectedShape;
      this.ShapeWasCopied = true;
      // alert('Shape copied');
    }
    if (this.CurrentMode === 'paste') {
      let x = this.CopiedShape.clone();
      x.Move_shape(x.start_x, x.start_y, this.start_x, this.start_y);
      x.draw_shape(this.ctx);
      this.AllShapes.push(x);
      this.OperationsToUndo.push(new operation('draw', 0, x.clone()));
      this.OperationsToRedo.splice(0);
    }
    if (this.CurrentMode === 'delete' && this.ShapeWasSelected) {
      this.OperationsToUndo.push(new operation('delete', this.foundAt, this.AllShapes[this.foundAt]));
      this.OperationsToRedo.splice(0);
      console.log(this.OperationsToUndo);
      this.AllShapes.splice(this.foundAt, 1);
      this.Draw_AllShapes();
    }
    if (this.CurrentMode === 'resize' && this.ShapeWasSelected) {
      this.ResizingEnabled = true;
    }
    this.StartedDrawing = false;
    this.ShapeWasSelected = false;
    if (!this.ShapeMoved && !this.Drawed) {
      return;
    }

    if (this.ShapeMoved) {
      this.OperationsToUndo.push(new operation('replace', this.foundAt, this.SelectedShape));
      this.OperationsToRedo.splice(0);
    }
    if (this.Drawed) {
      let x = this.OurFactory.CreateShape(this.CurrentTool, this.start_x, this.start_y, event.offsetX, event.offsetY, this.color, this.size, this.fill);
      this.AllShapes.push(x!);
      this.OperationsToUndo.push(new operation('draw', 0, x?.clone()!));
      this.OperationsToRedo.splice(0);
      console.log(this.AllShapes);
    }
    this.Drawed = false;
    this.ShapeMoved = false;
  }
  onmouseleave(event: MouseEvent) {
    if (this.CurrentMode === 'move' || this.CurrentMode === 'delete' || this.CurrentMode === 'copy' || this.CurrentMode === 'resize') {
      this.canvas.style.cursor = 'default';
    }
    this.StartedDrawing = false;
    this.ShapeWasSelected = false;
    if (!this.ShapeMoved && !this.Drawed) {
      return;
    }
    if (this.ShapeMoved) {
      this.OperationsToUndo.push(new operation('replace', this.foundAt, this.SelectedShape));
      this.OperationsToRedo.splice(0);
    }
    if (this.Drawed) {
      let x = this.OurFactory.CreateShape(this.CurrentTool, this.start_x, this.start_y, event.offsetX, event.offsetY, this.color, this.size, this.fill);
      this.AllShapes.push(x!);
      this.OperationsToUndo.push(new operation('draw', 0, x?.clone()!));
      this.OperationsToRedo.splice(0);
    }
    this.Drawed = false;
    this.ShapeMoved = false;
  }
  saveDraw(){
    let Alert!:any;
    let path= prompt("please Enter File Name (.xml or .json)","name.xml");
    if(path?.includes(".xml")||path?.includes(".json")){
      this.paintsrvs.sendPath(path!).subscribe((response:String)=>{
        Alert=response;
        console.log(Alert);
      });
      this.paintsrvs.saveShapes(this.AllShapes).subscribe((response:String)=>{
       Alert=response;
      })
      
    }else if(path===null){
    }else{
      alert("Enter appropriate extension (.xml or .json)")
    }
  }
  loadDraw(){
    let path=prompt("please Enter File Name (.xml or .json)","name.xml");
    if(path?.includes(".xml")||path?.includes(".json")){
      this.paintsrvs.loadShapes(path!).subscribe((response:any)=>{
        // if(response === null){
        //  alert("File Not Found");

        // }else{
          this.loadedShapes=response;
          console.log(this.loadedShapes);
          this.AllShapes.splice(0);
          this.OperationsToUndo.splice(0);
          this.OperationsToRedo.splice(0);
          for(let i=0;i<this.loadedShapes.length;i++){
           switch(this.loadedShapes[i].name){
             case 'circle':
               this.AllShapes.push(new circle(this.loadedShapes[i]._start_x,this.loadedShapes[i]._start_y,this.loadedShapes[i]._color,this.loadedShapes[i]._LineWidth,this.loadedShapes[i]._fill,this.loadedShapes[i].radius));
               break;
             case 'square':
               this.AllShapes.push(new square(this.loadedShapes[i]._start_x,this.loadedShapes[i]._start_y,this.loadedShapes[i]._color,this.loadedShapes[i]._LineWidth,this.loadedShapes[i]._fill,this.loadedShapes[i].side1,this.loadedShapes[i].side2));
              break;
             case 'line':
               this.AllShapes.push(new line(this.loadedShapes[i]._start_x,this.loadedShapes[i]._start_y,this.loadedShapes[i]._color,this.loadedShapes[i]._LineWidth,this.loadedShapes[i]._fill,this.loadedShapes[i].end_x,this.loadedShapes[i].end_y));
               break;
             case 'rect':
               this.AllShapes.push(new rect(this.loadedShapes[i]._start_x,this.loadedShapes[i]._start_y,this.loadedShapes[i]._color,this.loadedShapes[i]._LineWidth,this.loadedShapes[i]._fill,this.loadedShapes[i].width,this.loadedShapes[i].length));
              break;
              case 'triangle':
               this.AllShapes.push(new triangle(this.loadedShapes[i]._start_x,this.loadedShapes[i]._start_y,this.loadedShapes[i]._color,this.loadedShapes[i]._LineWidth,this.loadedShapes[i]._fill,this.loadedShapes[i].end_x,this.loadedShapes[i].end_y));
               break;
             case 'ellipse':
               this.AllShapes.push(new ellipse(this.loadedShapes[i]._start_x,this.loadedShapes[i]._start_y,this.loadedShapes[i]._color,this.loadedShapes[i]._LineWidth,this.loadedShapes[i]._fill,this.loadedShapes[i].major_axis,this.loadedShapes[i].minor_axis));
              break;
               default:
               break;
           }
         }
         this.Draw_AllShapes(); 
        // }

     });
     console.log(this.AllShapes);

    }else if(path===null){
    }else{
      alert("Enter appropriate extension (.xml or .json)")
    }
   }
   toggleL = true;
   toggleC = true;
   toggleS = true;
   toggleR = true;
   toggleT = true;
   toggleE = true;
   toggleM = true;
   toggleCO = true;
   toggleD = true;
   toggleRS = true;
   toggleP = true;
   
   // function to toggle the color of the button (shapes and edit)
   enableDisableRule(job: any) {
     
     switch(job) {
       case "line":
         this.toggleL = !this.toggleL;
         if(this.toggleL===true){
           this.CurrentTool = '';
           this.display = false;
           this.canvas.style.cursor = 'default';
         }
         this.toggleC = true;
         this.toggleS = true;
         this.toggleR = true;
         this.toggleT = true;
         this.toggleE = true;
         this.toggleM = true;
         this.toggleCO = true;
         this.toggleD = true;
         this.toggleRS = true;
         this.toggleP = true;
   
       break;
       case "square":
         this.toggleS = !this.toggleS;
         if(this.toggleS===true){
           this.CurrentTool = '';
           this.display = false;
           this.canvas.style.cursor = 'default';
         }
         this.toggleL = true;
         this.toggleC = true;
         this.toggleR = true;
         this.toggleT = true;
         this.toggleE = true;
         this.toggleM = true;
         this.toggleCO = true;
         this.toggleD = true;
         this.toggleRS = true;
         this.toggleP = true;
   
       break;    
       case "triangle":
         this.toggleT = !this.toggleT;
         if(this.toggleT===true){
           this.CurrentTool = '';
           this.display = false;
           this.canvas.style.cursor = 'default';
           
         }
         this.toggleL = true;
         this.toggleC = true;
         this.toggleS = true;
         this.toggleR = true;
         this.toggleE = true;
         this.toggleM = true;
         this.toggleCO = true;
         this.toggleD = true;
         this.toggleRS = true;
         this.toggleP = true;
   
       break;    
       case "rectangle":
         this.toggleR = !this.toggleR;
         if(this.toggleR===true){
           this.CurrentTool = '';
           this.display = false;
           this.canvas.style.cursor = 'default';
         }
         this.toggleL = true;
         this.toggleC = true;
         this.toggleS = true;
         this.toggleT = true;
         this.toggleE = true;
         this.toggleM = true;
         this.toggleCO = true;
         this.toggleD = true;
         this.toggleRS = true;
         this.toggleP = true;
   
       break;    
       case "ellipse":
         this.toggleE = !this.toggleE;
         if(this.toggleE===true){
           this.CurrentTool = '';
           this.display = false;
           this.canvas.style.cursor = 'default';
         }
         this.toggleL = true;
         this.toggleC = true;
         this.toggleS = true;
         this.toggleR = true;
         this.toggleT = true;
         this.toggleM = true;
         this.toggleCO = true;
         this.toggleD = true;
         this.toggleRS = true;
         this.toggleP = true;
   
       break;    
       case "circle":
         this.toggleC = !this.toggleC;
         if(this.toggleC===true){
           this.CurrentTool = '';
           this.display = false;
           this.canvas.style.cursor = 'default';
         }
         this.toggleL = true;
         this.toggleS = true;
         this.toggleR = true;
         this.toggleT = true;
         this.toggleE = true;
         this.toggleM = true;
         this.toggleCO = true;
         this.toggleD = true;
         this.toggleRS = true;
         this.toggleP = true;
   
       break;    
       case "move":
         this.toggleM = !this.toggleM;
         if(this.toggleM===true){
           this.CurrentMode = '';
           this.CurrentTool = '';
           this.display = false;
           this.canvas.style.cursor = 'default';
         }
         this.toggleL = true;
         this.toggleC = true;
         this.toggleS = true;
         this.toggleR = true;
         this.toggleT = true;
         this.toggleE = true;
         this.toggleCO = true;
         this.toggleD = true;
         this.toggleRS = true;
         this.toggleP = true;
   
       break;    
       case "delete":
         this.toggleD = !this.toggleD;
         if(this.toggleD===true){
           this.CurrentMode = '';
           this.CurrentTool = '';
           this.display = false;
           this.canvas.style.cursor = 'default';
         }
         this.toggleL = true;
         this.toggleC = true;
         this.toggleS = true;
         this.toggleR = true;
         this.toggleT = true;
         this.toggleE = true;
         this.toggleM = true;
         this.toggleCO = true;
         this.toggleRS = true;
         this.toggleP = true;
   
       break;
       case "copy":
         this.toggleCO = !this.toggleCO;
         if(this.toggleCO===true){
           this.CurrentMode = '';
           this.CurrentTool = '';
           this.display = false;
           this.canvas.style.cursor = 'default';
         }
         this.toggleL = true;
         this.toggleC = true;
         this.toggleS = true;
         this.toggleR = true;
         this.toggleT = true;
         this.toggleE = true;
         this.toggleM = true;
         this.toggleD = true;
   
         this.toggleRS = true;
         this.toggleP = true;
       break;    
       case "resize":
         this.toggleRS = !this.toggleRS;
         if(this.toggleRS===true){
           this.CurrentMode = '';
           this.CurrentTool = '';
           this.display = false;
           this.canvas.style.cursor = 'default';
         }
         this.toggleL = true;
         this.toggleC = true;
         this.toggleS = true;
         this.toggleR = true;
         this.toggleT = true;
         this.toggleE = true;
         this.toggleM = true;
         this.toggleD = true;
   
         this.toggleCO = true;
         this.toggleP = true;
       break;
       case "paste":
         this.toggleP = !this.toggleP;
         if(this.toggleP===true){
           this.CurrentMode = '';
           this.CurrentTool = '';
           this.display = false;
           this.canvas.style.cursor = 'default';
         }
         this.toggleL = true;
         this.toggleC = true;
         this.toggleS = true;
         this.toggleR = true;
         this.toggleT = true;
         this.toggleE = true;
         this.toggleM = true;
         this.toggleD = true;
   
         this.toggleCO = true;
         this.toggleRS = true;
         break;
       default: 
       this.CurrentMode = '';
       this.CurrentTool = '';
       this.display = false;
       this.canvas.style.cursor = 'default';
       this.toggleL = true;
       this.toggleC = true;
       this.toggleS = true;
       this.toggleR = true;
       this.toggleT = true;
       this.toggleE = true;
       this.toggleM = true;
       this.toggleD = true;
       this.toggleCO = true;
       this.toggleRS = true;
       this.toggleP = true;
       break;
   }
   
   }
}



