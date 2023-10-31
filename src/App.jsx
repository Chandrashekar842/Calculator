import React from 'react'
import './styles.css'
import { useReducer } from 'react'
import { DigitButton } from './DigitButton'
import { OperationButton } from './OperationButton'

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  EVALUATE: 'evaluate',
  REMOVE_DIGIT: 'remove-digit',
  ADD_OPERATION: 'add-operation'
}

const reducer = (state, {type, payload}) => {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: payload.digit,
        }
      }
      if(payload.digit === '0' && state.currentOperand === '0') {      
        return state
      } 
      if(payload.digit === '.' && state.currentOperand.includes('.')) {
        return state
      }
      return {...state, 
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
      }
    
    case ACTIONS.CLEAR:
      return { }

    case ACTIONS.ADD_OPERATION:
      if(state.previousOperand == null && state.currentOperand == null) {
        return state
      }
      if(state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }
      if(state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }

    case ACTIONS.EVALUATE:
      if(state.operation == null || state.previousOperand == null || state.currentOperand == null) {
        return state
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      }

    case ACTIONS.REMOVE_DIGIT: 
      if(state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }
      if(state.currentOperand == null) return state
      if(state.currentOperand.length == 1) {
        return {
          ...state,
          currentOperand: null
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0,-1),
      }
  }
}

const evaluate = ({currentOperand, previousOperand, operation}) => {
  const prev = parseFloat(previousOperand)
  const curr = parseFloat(currentOperand)
  if(isNaN(prev) || isNaN(curr)) return ''
  let result = ''
  switch(operation) {
    case '+':
      result = prev+curr
      break
    case '-':
      result = prev-curr
      break
    case '*':
      result = prev*curr
      break
    case '/':
      result = prev/curr
      break
  }
  return result.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

export default function App() {

  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})

  return (
    <div className="calculator">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button 
        onClick={() => dispatch({type:ACTIONS.CLEAR})} 
        className='span-two' 
        >AC
      </button>
      <button
        onClick={(e) => dispatch({type:ACTIONS.REMOVE_DIGIT})}
        >DEL
      </button>
      <OperationButton operation='/' dispatch={dispatch} />
      <DigitButton digit='1' dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation='*' dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation='+' dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation='-' dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button 
        className='span-two'
        onClick= {() => dispatch({type: ACTIONS.EVALUATE})}
        > =</button>
    </div>
  )
}