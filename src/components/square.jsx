export const Square = ({children, isSelected, updateBoard, index}) => {
    const className = `square ${isSelected ? 'is-selected' : ''}`
    
    const handleClick = () => {
      updateBoard(index)
      console.log(index)
    }
  
    return (
      /*cuando se le de click al square que es el componente 
      ejecutara el onclick que llama la funcion handleClick */
      <div onClick={handleClick} className={className}>
        
        {children}
      </div>
    )
  }