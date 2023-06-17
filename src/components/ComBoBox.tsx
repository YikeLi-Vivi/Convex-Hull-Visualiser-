import Select from "react-select"
interface Prop {
    selections: string []
}
const ComBoBox = (props: Prop) => {

    const {selections} = props 
    let options: any []= []

    selections.map((m, idx) => {options.push({value: m, label: m})})

  return (
    <Select options={options}/>
  )
}

ComBoBox.propTypes = {}

export default ComBoBox