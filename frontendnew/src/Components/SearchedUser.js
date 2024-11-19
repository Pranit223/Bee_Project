import React from 'react'

const SearchedUser = ({searchUser,handleFunction,selectedChat}) => {
  // search-user-each
  return (
    <div onClick={handleFunction} className={selectedChat?("search-user-each second"):("search-user-each")}>
        <div className="search-pic">
            <img className="search-image" src={searchUser.pic} alt="" />
        </div>
        <div className="search-content">
            <h3>{searchUser.name}</h3>
            <h4>Email:{searchUser.email}</h4>
        </div>
    </div>
  )
}

export default SearchedUser