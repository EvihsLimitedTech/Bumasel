const slug = (value) =>{
    if( value === undefined) {
        return
    }
    var chars = ".,/-:@"
    for(ch in chars.split("")) {
        value.trim().replace(ch , "_")
    }
    return value
}

module.exports = {slug}