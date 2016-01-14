Wesley Minner
703549234
CS 174A, Fall 2015

***Necessary Files***
******************
Place/overwrite in "WebGL_Template" folder using template
-animation.js
-index.html
-block2.png
-ground4.png
-mushroom.png
-mushroom2.png
-whispy_woods.png
-the_end.png
-Green_Greens.mp3

Place/overwrite in "Common" folder using template
-GL_Context.js
-shape.js

-readme.txt


***Change List***
*****************
animation.js
-Coding to create and transform the animation.

index.html
-Fix lighting bug by normalizing lines 34 and 52.
-Fix gouraud alpha channel bug on line 62.
-Fix fragcolor bug on line 104.

GL_Context.js
-Comment out UI overlays from the template. 
-Texture additions.

shape.js
-Add half_sphere class.
-Add pyramid class.


***Grading Checklist***
***********************
[X][4 points] At least one two-level hierarchical object (e.g., a human arm).  		
-Kirby eyes (drawKirbyXXXXXXX), mushroom enemy (drawMushroom)

[X][4 points] At least one texture, either procedural or mapped.	
-Background, block, ground, mushroom, and end screen textures

[X][4 points] Demonstrate manual camera fly-around using LookAt. 	
-Flying camera around Kirby as he runs

[X][6 points] Polygonal objects of your own (you must provide positions, normals, and texture coordinates directly, by extending the Shape class), drawn in different places using both flat shading and smooth shading variants of the hong reflection model.		
-Defined half_sphere class, based off of sphere class, in order to make mushroom enemy (common kirby enemy) and to satisfy the smooth shading requirement.
-Defined pyramid class from scratch, in order to make a different style of mushroom and to satisfy the flat shading requirement.

[X][2 points] Real-time speed. Make sure that your animation runs at the same speed no matter how fast of a machine your program runs on. “Real time” means that one simulated second corresponds roughly to one real second.	
-Everything scaled by animation_delta_time or using animation_time (which is based on animation_delta_time)

[X][2 points] Display the frame rate of your program on the graphics window.	
-Displayed in upper left corner, refreshing every 0.2 seconds

[X][2 points] Make and submit a movie of your animation using your favorite screen recording application (camstudio/quicktime). If your application is interactive, your submission must be a video of it being used. You can add subtitles. Make sure you encode your movie to within 100MB.
-Submitted in zip file

[X][4 points] Creativity (story, colors, etc). 		
-To be judged by grader

[X][4 points] Complexity.				
-To be judged by grader

[X][5 points] Overall quality: Object and camera motion, scene construction, proper texturing, attention to detail.	
To be judged by grader


***Citations***
***************
Background Texture:  http://whispy-woods.tumblr.com/post/56606408915
Block and Ground Texture:  http://s7.zetaboards.com/Kirbys_Dream_World/topic/1124150/1/
Music:  Tomoya Tomita, Jun Ishikawa, Hirokazu Ando (Artists) - Kirby's Dream Collection Special Edition (Album) - Green Greens: Epic Yarn (Song)