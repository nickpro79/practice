import "./styles.css"
import DigitButton from "./DigitButton"
import OperationButton from "./OperationButton"
import {useReducer} from "react"


export const ACTIONS ={
  ADD_DIGIT:'add-digit',
  DELETE_DIGIT:'delete-digit',
  CLEAR:'clear',
  CHOOSE_OPERATION:'choose-operation',
  EVALUATE:'evaluate',
}

function reducer(state, { type, payload }){
 switch(type){
    case ACTIONS.ADD_DIGIT:
      if(state.overwrite){
        return{
          ...state,
          currentOperand:payload.digit,
          overwirte:false,
        }
      }
      if(payload.digit === "0" && state.currentOperand==="0"){return state} 
      if(payload.digit === "." && state.currentOperand.includes(".")){ return state}
      return {
         ...state,
         currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }

    case ACTIONS.CHOOSE_OPERATION:  
    if(state.previousOperand == null && state.currentOperand == null){
        return state
      } 
    if(state.currentOperand==null){
      return{
        ...state,
        Operation:payload.operation,
      }
    }  
    if (state.previousOperand == null) {
       return {
          ...state,
          Operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        }
      }
    return{
      ...state,
      previousOperand: evaluate(state),
      Operation: payload.operation,
      currentOperand: null,
    }

    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.DELETE_DIGIT:
        if(state.overwrite) {
          return{
            ...state,
            overwrite:false,
            currentOperand:null,
          }
        }
        if(state.currentOperand == null) return state
        if(state.currentOperand.length === 1){
          return{
            ...state,
            currentOperand: null,
          }
        }
        return{
          ...state,
          currentOperand:state.currentOperand.slice(0,-1)
        }
       
        case ACTIONS.EVALUATE:
          if(state.Operation==null||state.currentOperand==null||state.previousOperand==null){
            return state
          }
           return{
            ...state,
            overwrite:true,
            currentOperand:evaluate(state),
            previousOperand:null,
            Operation:null,
          }
      }
}

function evaluate({currentOperand,previousOperand,Operation}){
  const prev = parseFloat(previousOperand)
  const curr = parseFloat(currentOperand)
  if(isNaN(prev)||isNaN(curr)) return ""
  let comp = ""
  switch(Operation){
    case "+":
      comp = prev + curr 
      break
    case "-":
      comp = prev - curr 
      break
    case "*":
      comp = prev * curr 
      break     
    case "÷":
      comp = prev / curr 
      break
  }
return comp.toString()
}

const FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return FORMATTER.format(integer)
  return `${FORMATTER.format(integer)}.${decimal}`
}
function App(){
  const[{ currentOperand, previousOperand, Operation }, dispatch] = useReducer(reducer,{})
  
  
  return(
    <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">{formatOperand(previousOperand)}{Operation}</div>
          <div className="current-operand">{formatOperand(currentOperand)}</div>
        </div>
    <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
    <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
    <OperationButton operation ="÷" dispatch={dispatch}/>
    <DigitButton digit ="1" dispatch={dispatch}/>
    <DigitButton digit ="2" dispatch={dispatch}/>
    <DigitButton digit ="3" dispatch={dispatch}/>
    <OperationButton  operation ="*" dispatch={dispatch}/>
    <DigitButton digit ="4" dispatch={dispatch}/>
    <DigitButton digit ="5" dispatch={dispatch}/>
    <DigitButton digit ="6" dispatch={dispatch}/>
    <OperationButton  operation="+"  dispatch={dispatch}/>
    <DigitButton digit ="7" dispatch={dispatch}/>
    <DigitButton digit ="8" dispatch={dispatch}/>
    <DigitButton digit ="9" dispatch={dispatch}/>
    <OperationButton  operation="-"  dispatch={dispatch}/>
    <DigitButton digit ="." dispatch={dispatch}/>
    <DigitButton digit ="0" dispatch={dispatch}/>
    <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})} >=</button>
    </div>
   
  )
    
  
}

export default App;