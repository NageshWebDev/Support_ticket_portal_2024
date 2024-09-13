export default function getAssignedClass(status){
    let cssClass = 'px-2 py-1 rounded-md inline-block w-28 text-center border'
    return status.toLowerCase() =='assigned' ? `bg-green-50 !text-green-600 border-green-300 ${cssClass}` :`bg-red-50 !text-red-600 ${cssClass} border-red-200`
}