# 3D Projections for Wireframe Rendering

### <i>Tseng Yang, Owen Xiong, Matt Westerhaus </i>

This is a project that I worked on with a team of students in my computer graphics class in Spring 2022. In this project we were tasked with creating models in 2D space that appeared as if they were 3D. Here are the steps that we went through to achieve this:

1) Mathematically create models of polygons based off of a user's given central point. Our program then calcuates how to draw lines between each needed point in the model. In the case of a generic object, the user specifies each line. 
2) Used matric multiplication to determine, based on the user's inputted preference of view between perspective (with depth perception) or parallel (no depth perception), where on the screen each point of each model should be placed to appear as it should.
3) Based on the user's input of animation/ rotation per second, use matrix multiplication to make the model look like it is spinning.
4) When the program is running, the user can use the arrow left and right keys to make the models rotate clockwise and counterclockwise around the central point of the current view. To achieve this we again used matrix multiplation.
5) When the program is running, the user can use the WASD keys to move the view frame forwards, backwards, left and right. This again was achieved by using matrix multiplication on each point in each model. 
6) The program also has a front and back clipping plane too. When the model hits these planes, they get cut off and points are created where the model hits the plane and appears flat there. 


## Example of how to add create each shape:

1) Cube  
{  
  "type": 'cube',  <br/>
  "center": [10, 0, -20],   
  "width": 10,  
  "height": 10,  
  "depth": 10,  
  "animation": {  
    &nbsp;&nbsp;&nbsp;&nbsp;"axis": "y",  
    &nbsp;&nbsp;&nbsp;&nbsp;"rps": 1  
  }   
}
  
 2) Cone  
 {
  "type": "cone",  
  "center": [-30, 10, -30],  
  "radius": 10,  
  "height": 50,  
  "sides": 50,  
  "animation": {  
    &nbsp;&nbsp;&nbsp;&nbsp;"axis": "y",  
    &nbsp;&nbsp;&nbsp;&nbsp;"rps": 2  
   }    
  }  
   
  3) Cylinder
   {  
       "type": "cylinder",  
       "center": [-30, 25, -10],  
       "radius": 5,  
       "height": 40,  
       "sides": 50,  
       "animation": {  
           &nbsp;&nbsp;&nbsp;&nbsp;"axis": "y",  
           &nbsp;&nbsp;&nbsp;&nbsp;"rps": 3  
       }  
  }  
  
  4) Sphere
  {    
     "type": "sphere",  
     "center": [-15, 45, -65],  
     "radius": 20,  
     "slices": 20,  
     "stacks": 20,  
     "animation": {  
          &nbsp;&nbsp;&nbsp;&nbsp;"axis": "y",  
          &nbsp;&nbsp;&nbsp;&nbsp;"rps": 4  
     }  
  }  
  
  
  5) Generic Shape (completely user inputted by specifying lines)   
 {  
      type: 'generic',  
      vertices: [  
      Vector4( 20,  0, -30, 1),  
      Vector4(20,  12, -30, 1),   
      Vector4(10, 20, -30, 1),   
      Vector4(0, 12, -30, 1),   
      Vector4( 0, 0, -30, 1),                   
      Vector4( 20,  0, -60, 1),   
      Vector4(20,  12, -60, 1),  
      Vector4(10, 20, -60, 1),   
      Vector4(0, 12, -60, 1),   
      Vector4( 0, 0, -60, 1)    
      ],  
      edges: [  
        &nbsp;&nbsp;&nbsp;&nbsp;[0, 1, 2, 3, 4, 0],   
        &nbsp;&nbsp;&nbsp;&nbsp;[5, 6, 7, 8, 9, 5],   
        &nbsp;&nbsp;&nbsp;&nbsp;[0, 5],   
        &nbsp;&nbsp;&nbsp;&nbsp;[1, 6],   
        &nbsp;&nbsp;&nbsp;&nbsp;[2, 7],  
        &nbsp;&nbsp;&nbsp;&nbsp;[3, 8],  
        &nbsp;&nbsp;&nbsp;&nbsp;[4, 9]  
      ],  
      matrix: new Matrix(4, 4),  
      "animation": {  
          &nbsp;&nbsp;&nbsp;&nbsp;"axis": "y",  
          &nbsp;&nbsp;&nbsp;&nbsp;"rps": .5  
      }   
}  

## How to run the program in Visual Studio.

After inputting the user's desired shapes into the code in "renderscene.js", to run the program one must simply
1) Download Microsoft's Live Share extension
2) Select the "Go Live" button in the bottom right of the screen
3) Play around with your finished product. 


In this project the primary concepts learned were javascript and matrix multiplications.
This project uses the HTML5 Canvas 2D API.


