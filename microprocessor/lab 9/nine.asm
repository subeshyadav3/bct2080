.MODEL SMALL
.STACK 64
.DATA
    MSG DB "ENTER A STRING: $"
    STR DB 50, ?, 50 DUP('$')   ; Input buffer (max 50 chars)
    
.CODE
MAIN PROC
    ; Initialize Data Segment
    MOV AX, @DATA
    MOV DS, AX

    ; Display message for user input
    MOV AH, 09H
    LEA DX, MSG
    INT 21H

    ; Take input from user (max 50 characters)
    MOV AH, 0AH
    LEA DX, STR
    INT 21H

    ; Clear screen
    MOV AX, 03H
    INT 10H

    ; Setup variables
    LEA SI, STR + 2  ; Skip first two bytes (buffer size info)
    MOV DH, 0        ; Row position (starting from top)
    MOV DL, 0        ; Column position (starting from left)
    MOV CX, 0        ; Store word length

PRINT_WORD:
    ; Set cursor position (row = DH, col = DL)
    MOV AH, 02H
    MOV BH, 00H
    INT 10H

    MOV CX, 0        ; Reset word length counter

PRINT_CHAR:
    MOV AL, [SI]
    CMP AL, ' '      ; Check if it's a space (end of a word)
    JE NEW_LINE
    CMP AL, 0DH      ; Check if end of input (ENTER key)
    JE END_PROGRAM

    ; Print character
    MOV AH, 0EH      ; BIOS teletype output
    INT 10H

    ; Move to next character
    INC SI
    INC CX           ; Increase word length counter
    JMP PRINT_CHAR

NEW_LINE:
    ; Move cursor down and update DL based on the length of the last word
    INC DH           ; Move one row down
    ADD DL, CL       ; Move right by word length
    INC DL           ; Add extra space for separation
    INC SI           ; Skip space
    JMP PRINT_WORD   ; Start printing the next word

END_PROGRAM:
    MOV AH, 4CH      ; Exit program
    INT 21H

MAIN ENDP
END MAIN
