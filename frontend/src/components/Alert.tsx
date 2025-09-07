const Alert = ({alerta}: { alerta: {msg: string | null, error: boolean} }) => {
  return (
    <div className={`${alerta.error ? 'from-red-400 to-red-600' : 'from-indigo-400 to-indigo-400'} bg-gradient-to-r text-center p-3 rounded-xl uppercase text-white font-bold text-sm mb-10`}>
        {alerta.msg}
    </div>
  )
}

export default Alert