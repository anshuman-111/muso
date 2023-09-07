export const handleDateCompare = (start, end) => {
    const startDate = new Date(start).getTime()
    const endDate = new Date(end).getTime()

    if(startDate > endDate){
        return false
    }
    return true
    


}