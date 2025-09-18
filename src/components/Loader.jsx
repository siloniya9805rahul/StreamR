
import {Loader2 } from "lucide-react";

function Load({color,classes}) {
  return (
    <Loader2 className={`animate-spin w-10 h-10 text-${color?"color":"gray"}-500 ${classes?classes:""}`} />
  )
}

export default Load