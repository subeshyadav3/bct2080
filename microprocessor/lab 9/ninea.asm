TITLE 20*20 WINDOW SCROLLING
.MODEL SMALL
.STACK 100H
.DATA
MESSAGE DB "Programming in Assembly Language is Fun$"  ; Message to display

.CODE
MAIN PROC FAR
    MOV AX, @DATA
    MOV DS, AX

    ;; CLEARING THE SCREEN
    MOV AH, 00H   ; Function: Set Video Mode
    MOV AL, 03H   ; Mode 03H: Text Mode 80x25
    INT 10H       ; BIOS Interrupt

    ;; SCROLLING A WINDOW (Reverse Video)
    MOV AH, 06H   ; Function: Scroll Window Up
    MOV AL, 00H   ; Scroll entire window
    MOV CH, 05H   ; Top-left row (row 5)
    MOV CL, 20H   ; Top-left column (col 20)
    MOV DH, 20H   ; Bottom-right row (row 20)
    MOV DL, 60H   ; Bottom-right column (col 60)
    MOV BH, 70H   ; Reverse Video: Black Text on Light Gray Background
    INT 10H       ; Call BIOS video interrupt

    ;; SET CURSOR POSITION AT (Row 12, Column 30)
    MOV AH, 02H   ; Function: Set Cursor Position
    MOV BH, 00H   ; Page number (0)
    MOV DH, 12H   ; Row 12
    MOV DL, 30H   ; Column 30
    INT 10H       ; BIOS interrupt

    ;; DISPLAY MESSAGE AT CURSOR POSITION
    LEA DX, MESSAGE  ; Load message address
    MOV AH, 09H      ; Function: Print String
    INT 21H          ; DOS interrupt

    ;; ENDING THE PROGRAM
    MOV AH, 4CH  ; Function: Terminate Program
    INT 21H      ; DOS interrupt

MAIN ENDP
END MAIN
