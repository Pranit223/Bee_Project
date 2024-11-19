import React from 'react'
import CancelSharpIcon from '@mui/icons-material/CancelSharp';
const SelectedtUserTag = ({SelectedUser,Handleremove}) => {
  return (
    <div className='SelectedUser-tag' onClick={Handleremove}>
        <p>{SelectedUser.name} </p>
        <CancelSharpIcon style={{ color: 'white' }}/>
        
    </div>
  )
}

export default SelectedtUserTag