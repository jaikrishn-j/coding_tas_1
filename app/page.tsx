
import CubeLogo from './components/CubeLogo'


type Props = {}

const page = (props: Props) => {
  return (
    <>
      {/* <AnimatedHero /> */}

      <CubeLogo />

      <section className='h-screen w-screen bg-[#CDB9AB] flex justify-center items-center'>
        <h1 className='text-xl font-bold'>Your next section goes here.</h1>
      </section>

    </>
  )
}

export default page