# Cube Algorithm Trainer

An algorithm trainer for cube puzzles. Currently it supports 3x3x3 and 2x2x2.

## How to use

First, select an algorithm set from the navigation menu at the top of the page. It will generate a timer with scrambles that you can use on your puzzle. You can disable subsets by unchecking the checkboxes below the timer display. That way you won't get scrambles from those subsets. You can also disable specific cases by unchecking the checkboxes in the algset manager window.

## Smart training

There's an option in the settings window which is enabled by default, called smart training. What it does is, when you reach at least 5 times with each enabled case, the scrambles will be based on the times you take to solve each case: the slower you solve a case, the more likely you'll get that case again.

## Algset input

1. Start with `///` followed by the event name. For example: `///3x3`, `///2x2`.
2. Then start a new line with `//` followed by the algset name. For example: `//OLL`, `//EG1`<br>
2.1 (Optional) You may add a `@` followed by cube rendering options, separated by a comma `,` (the options are listed below). The view option will change the view of the cube either to LL (last layer) or normal (three-dimensional). For example: `//OLL@mask:oll,view:ll`
3. On the next line, use `/` followed by the subset* name. For example: `/H` `/AS`, `/Pi`, `/OCLL`
4. After that, start inputting algorithms for that subset, each one in a different line. For example: `R U R' U'`, `R' F R F'`.
5. Put algorithms that solve the exact same case** in a block with no empty lines in between, and use and empty line between different cases. You may have as many cases as you want inside a subset.
6. From here you may add another subset or even algset by going back to step 3 or 1 (remember to not leave empty lines except for different cases).

_*Subset in this context is a set of cases that can be easily disabled/enabled when training._<br>
_**Case in this context is a state that may be solved with multiple different algorithms. They are numbered starting from 1 and have no name._<br>

Cube rendering options:<br>
`view`: `LL`<br>
`mask`: `fl, f2l, ll, cll, ell, oll, ocll, oell, coll, ocell, wv, vh, els, cls, cmll, cross, f2l#3, f2l#2, f2l sm, f2l#1, f2b, line`

Examples:

OLL
```
///3x3
//OLL@mask:oll,view:LL
/OCLL
R U2 R' U' R U' R'
y' R' U' R U' R' U2 R

R U R' U R U2' R'
y' R' U2' R U R' U R

(R U2 R') (U' R U R') (U' R U' R')
y (R U R' U) (R U' R' U) (R U2' R')

R U2' R2' U' R2 U' R2' U2' R

(r U R' U') (r' F R F')
y (R U R D) (R' U' R D') R2'

y F' (r U R' U') r' F R
x (R' U R) D' (R' U' R) D x'

R2 D (R' U2 R) D' (R' U2 R')
y2 R2' D' (R U2 R') D (R U2 R)
/T
(R U R' U') (R' F R F')

F (R U R' U') F'
/S
(r' U2' R U R' U r)

(r U2 R' U' R U' r')
/C
(R U R2' U') (R' F R U) R U' F'

R' U' (R' F R F') U R
/W
(R' U' R U') (R' U R U) l U' R' U x
y2 (R U R' F') (R U R' U') (R' F R U') (R' F R F')

(R U R' U) (R U' R' U') (R' F R F')
/E
(r U R' U') M (U R U' R')

(R U R' U') M' (U R U' r')
/P
(R' U' F) (U R U' R') F' R

R U B' (U' R' U) (R B R')
S (R U R' U') (R' F R f')

y R' U' F' U F R
f' (L' U' L U) f

f (R U R' U') f'
y2 F (U R U' R') F'
/I
f (R U R' U') (R U R' U') f'
y2 F (U R U' R') (U R U' R') F'

r' U' r (U' R' U R) (U' R' U R) r' U r

(R' U' R U' R' U) y' (R' U R) B
(R U R' U R U') y (R U' R') F'

y (R' F R U) (R U' R2' F') R2 U' R' (U R U R')
/F
(R U R' U') R' F (R2 U R' U') F'
(R' U' R) y r U' r' U r U r'

(R U R' U) (R' F R F') (R U2' R')
(R U R') y (R' F R U') (R' F' R)

(R U2') (R2' F R F') (R U2' R')

F (R U' R' U') (R U R' F')
/K
(r U' r') (U' r U r') y' (R' U R)
F U R U' R2' F' R U (R U' R')

(R' F R) (U R' F' R) (F U' F')

(r U r') (R U R' U') (r U' r')

(r' U' r) (R' U' R U) (r' U r)
/A
y (R U R' U') (R U' R') (F' U' F) (R U R')
M U (R U R' U')(R' F R F') M'

y' F U (R U2 R' U') (R U2 R' U') F'
y' (F R' F) (R2 U' R' U') (R U R') F2

(R U R' U R U2' R') F (R U R' U') F'

(R' U' R U' R' U2 R) F (R U R' U') F'
y (R' F R F') (R' F R F') (R U R' U') (R U R')
/L
F (R U R' U') (R U R' U') F'

F' (L' U' L U) (L' U' L U) F
R' U' (R' F R F') (R' F R F') U R

r U' r2' U r2 U r2' U' r

r' U r2 U' r2' U' r2 U r'
y' (R U2 R' U' R U' R') F (R U R' U') F'

(r' U' R U') (R' U R U') R' U2 r
y r' U2' R (U R' U' R) (U R' U r)

(r U R' U) (R U' R' U) R U2' r'
y' (r U2 R' U') (R U R' U') R U' r'
/B
(r U R' U R U2' r')

(r' U' R U' R' U2 r)
y2 l' U' L U' L' U2 l

r' (R2 U R' U R U2 R') U M'

M' (R' U' R U' R' U2 R) U' M
y F (R U R' U') F' U F (R U R' U') F'

(L F') (L' U' L U) F U' L'
F (R U R' U') F' (R' U' R U' R' U2 R)

(R' F) (R U R' U') F' U R
/O
(R U2') (R2' F R F') U2' (R' F R F')

F (R U R' U') F' f (R U R' U') f'
y (r U r') U2 R U2' R' U2 (r U' r')

f (R U R' U') f' U' F (R U R' U') F'

f (R U R' U') f' U F (R U R' U') F'

y R U2' (R2' F R F') U2' M' (U R U' r')
(r U R' U R U2 r') (r' U' R U' R' U2 r)

M U (R U R' U') M' (R' F R F')

(R U R' U) (R' F R F') U2' (R' F R F')

M U (R U R' U') M2' (U R U' r')
(r U R' U') M2' (U R U' R') U' M'
```

PLL
```
///3x3
//PLL@view:LL
/Ub
R2 U (R U R' U') R' U' (R' U R')
y2 (R' U R' U') R' U' (R' U R U) R2'
/Ua
(R U' R U) R U (R U' R' U') R2
y2 (R U R' U) (R' U' R2 U') R' U R' U R [U2]
y2 (R2 U' R' U') R U R U (R U' R)
/Z
(M2' U M2' U) (M' U2) (M2' U2 M') [U2]
y' M' U (M2' U M2') U (M' U2 M2) [U']
/H
(M2' U M2') U2 (M2' U M2')
/Aa
x (R' U R') D2 (R U' R') D2 R2 x'
y x' R2 D2 (R' U' R) D2 (R' U R') x
/Ab
x R2' D2 (R U R') D2 (R U' R) x'
y x' (R U' R) D2 (R' U R) D2 R2' x
/E
x' (R U' R' D) (R U R' D') (R U R' D) (R U' R' D') x
/Ga
R2 U (R' U R' U') (R U' R2) D U' (R' U R D') [U]
R2 u (R' U R' U') R u' R2 y' (R' U R)
/Gb
(F' U' F) (R2 u R' U) (R U' R u') R2'
y' R' U' y F (R2 u R' U) (R U' R u') R2'
y' D (R' U' R U) D' (R2 U R' U) (R U' R U') R2' [U']
/Gc
R2 U' (R U' R U) (R' U R2 D') (U R U' R') D [U']
y2 R2' F2 (R U2' R U2') R' F (R U R' U') R' F R2
/Gd
D' (R U R' U') D (R2 U' R U') (R' U R' U) R2 [U]
(R U R') y' (R2 u' R U') (R' U R' u) R2
/Ra
(R U' R' U') (R U R D) (R' U' R D') (R' U2 R') [U']
y' (L U2 L' U2) L F' (L' U' L U) L F L2' [U]
(R U R' F') (R U2' R' U2') (R' F R U) (R U2' R') [U']
/Rb
(R' U2 R U2') R' F (R U R' U') R' F' R2 [U']
(R' U2 R' D') (R U' R' D) (R U R U') (R' U' R) [U']
/Ja
(R' U L' U2) (R U' R' U2 R) L [U']
y' (L' U' L F) (L' U' L U) L F' L2' U L [U]
/Jb
(R U R' F') (R U R' U') R' F R2 U' R' [U']
/T
(R U R' U') (R' F R2 U') R' U' (R U R' F')
/F
(R' U' F')(R U R' U')(R' F R2 U')(R' U' R U)(R' U R)
y (R' U2 R' U') y (R' F' R2 U') (R' U R' F) R U' F
/V
(R' U R' U') y (R' F' R2 U') (R' U R' F) R F
/Y
F (R U' R' U') (R U R' F') (R U R' U') (R' F R F')
/Na
(R U R' U) (R U R' F') (R U R' U') (R' F R2 U') R' U2 (R U' R')
z (U R' D) (R2 U' R D') (U R' D) (R2 U' R D') [R'] z'
/Nb
(R' U R U') (R' F' U' F) (R U R' F) R' F' (R U' R)
(R' U L' U2 R U' L) (R' U L' U2 R U' L) [U]
```

EG1
```
//EG1@view:LL
/AS
y' B U' R2 F2 U' F x2
y R' F R2 U R' F' U' R U' R'

y R U' R' F' U' F2 R U' R'
R U' F2 R U2 R U' F

F' L F L' U' R U R' L' U' L
y' R U' R' U2 R' F R2 U2 R' F

R U' R' F' U' R U R' U' F

y' R U R' F' U' R U R' U' R U R'

y2 R U' R2 F R U' R' F R F' 
/H
U' R' F R2 U' R' F R U R' F' 
U' R' F R2 U' R2 U' F U R 
F' R2 F' R F R' U R' U 
U' R' F R' F U F' R2 F' 

U' F' U R U' R2 F2 R U' F
F R U' R2 F U' F2 U R
y' R2 U' R U' R' U R' U' R U' R2
y R2 U2 R U' R2 U' R2 U R2 U' R2

R' U' R' F2 U F' R F' 
U' F U2 R U' R' F2 R' F2 R F' 
U R' F R F' U2 F R U2 R' F 
U R U' R' F U2 x U' R' U2 R U' 

U' R U R' F' R U R' U' R U R' U' 
F' U R' F R F' U F2 
F' U2 F' U R' F' R F' 
/L
y R U' R' U R U' R2 F' R F
y2 R U R' F' R U2 R' U2 R U R'

y' R' F R F' R' F R U R U2 R'
y2 L' U L U' L' U L2 F L' F'

y R' U R2 U' R2 U' F R2 U' R'

y R' F R2 U R' F' R U2 R'

y2 R U R' F' R U R' U' F R' F' R
y2 L' U L y' R U2 R U' R2

y2 R' U2 F R U2 R U' R2 F
y R U' R' y' R' U2 R' U R2
y' R' F R F' U2 R U2 R' F R U' R'
/Pi
y2 R2 B2 R' U R' U' R U2 R U' R2
y2 F2 R U R' U2 R U R' U' F

y' R' F R2 U' R2 F R
y' R U R2 F' R2 U R'
y' R' F' R2 U R2 F' R
y' R U' R2 F R2 U' R'

y' F R' F U' F2 R U R

y' R U' R' U R U' R' F R U' R'
U' R2 F U' F2 U' F U' R' F2 R U' R'

y F U' R U2 R' F' R U R' F'
R U' R2 F R U R U' R' U' R' F R F'
R' U' R' F2 U' R U2 F2 R

F R U' R' F R U2 R' U F' 
y2 L U L F2 U L' U2 F2 L' 
/S
y' F' L U2 F2 R U' x'
z' R' U' R U2 x' U2 R U' z
y2 R U R' U F R U' R2 F' R

R U R' F2 U F R U R'
y2 F R2 U' R2 F U' F2 U' R
y' R' F R2 U' R2 F U' R U' R' U2 R

y2 F R' F' R U R' F' R2 U R'
y' R' F R U2 R U' R2 F2 R F'

F' U R U' R' U F R U R'
y2 F U' R U2 R' F2 R' F R
y F' R' F R2 U R' U' F R' F' R

y R U' R' U R U' R' U F R U' R'

R' F R2 U' R' U L F' L' F 
R' F R2 U' R' U R U' R' F 
/T
y R2 U R U' R2 F R U2 R' F
F R U' R2 F' R U R' F' R
y' L' U L U2 R' F2 R F' L' U L
y2 x R' U R U' R' U' R U' R' U' R U' x'

F' R' F R2 U R' U' R U R'
y2 R U' R' F R U' R' F R U R' F'

y R U' R2 F R U R U2 R'
y' L' U L2 F' L' U' L' U2 L

y' R2 B2 U' R' U' R U' R' U R'
U' R2 B2 U' R' U' R U' R' U R'

y R U R2 x U' R U R' U' R x'
y' R' F' R2 U R' F' R U R'

y2 R U' R' U2 F R U2 R' F 
y' R U R' F R U R' F U' R U' R' 
/U
y' R U R' U R U R2 F R2 U' R'
R U2 R U2 R U R2
y' R U' R2 F R2 U R' U' R U' R'

y x U' R' U R U' F R U R U' x'
y' F R U' R' F U' F' R' F' R
U F' R2 F' R2 F' U' F2 R2
y x U' R2 U' R2 U' x' U' F2 R2

F' U2 R U2 R' U2 F
R U R' U F' R U R' U' R' F2 R2 U' R'
R U R' U F' R U R' U' R U R2 F2 R

y R' F R F' R' F R2 U' R'
y' L F' L' F L F' L2 U L

y R' F R F' U R U' R' F R U' R'
y2 R U' R' U R U' R' U' F R U' R'
F2 R U2 R' U' F2 U2 F'

y2 R' F R2 U' R' U y' R U R'
```
