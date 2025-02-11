TITLE SCROLL_WINDOW
.MODEL SMALL
.STACK 100H
.DATA
    MSG DB 'Enter a string (max 14 chars): $'
    STR DB 15 DUP('$')  ; Buffer for user input (14 chars + null terminator)
    STRLEN DB 0         ; Stores actual string length
    NEWLINE DB 0DH,0AH,'$'  ; Newline for formatting output

.CODE
MAIN PROC
    ; Set up the data segment
    MOV AX, @DATA
    MOV DS, AX

    ; Display message for user input
    MOV DX, OFFSET MSG
    MOV AH, 09H
    INT 21H

    ; Take input from the user (max 14 characters)
    MOV AH, 0AH
    MOV DX, OFFSET STR
    MOV BYTE PTR [STR], 14  ; Max length
    MOV BYTE PTR [STR+1], 0 ; Initial length 0
    INT 21H

    ; Get actual length of input string
    MOV AL, [STR+1]
    MOV STRLEN, AL

    ; Set video mode to 03H (Text Mode)
    MOV AH, 00
    MOV AL, 03H
    INT 10H

    ; Scroll a 20x20 window in the center
    MOV CH, 05  ; Top-left row
    MOV CL, 20  ; Top-left column
    MOV DH, 24  ; Bottom-right row
    MOV DL, 60  ; Bottom-right column
    MOV AH, 06H ; Scroll up
    MOV AL, 00  ; Clear entire window
    MOV BH, 17H ; Color attribute (Blue BG, White FG)
    INT 10H

    ; Set cursor position to center of scrolled window (row=15, col=40)
    MOV AH, 02H
    MOV BH, 00
    MOV DH, 15  ; Row
    MOV DL, 40  ; Column
    INT 10H

    ; Display the user input string
    MOV DX, OFFSET STR+2  ; Skip first two bytes (max length, actual length)
    MOV AH, 09H
    INT 21H

    ; Wait for a key press before exiting
    MOV AH, 00
    INT 16H

    ; Terminate the program
    MOV AX, 4C00H
    INT 21H

MAIN ENDP
END MAIN
