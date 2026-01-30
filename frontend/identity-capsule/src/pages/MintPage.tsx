import { useSearchParams } from 'react-router-dom'
import { useAccount, useWriteContract } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { parseAbi } from 'viem'

export default function MintPage() {
  const [params] = useSearchParams()
  const project = params.get('project')
  const { address, isConnected } = useAccount()

  const contractAddress = '0xYourContractAddress' // ← غيّره بعنوان عقدك
  const abi = parseAbi([
    'function mintCapsule(address to, string uri) public'
  ])

  const { writeContract, isPending, isSuccess } = useWriteContract()

  const handleMint = () => {
    if (!address || !project) return
    const metadataUri = `https://yourdomain.com/metadata/${project}.json`
    writeContract({
      address: contractAddress,
      abi,
      functionName: 'mintCapsule',
      args: [address, metadataUri]
    })
  }

  return (
    <section className="section">
      <h2>🪪 Mint كبسولة المشروع</h2>
      {project ? (
        <>
          <h3>📦 {project}</h3>
          <p>يمكنك الآن توثيق هذا المشروع ككبسولة رمزية قابلة للتداول.</p>

          {isConnected ? (
            <>
              <p>✅ متصل بمحفظة: <strong>{address}</strong></p>
              <button
                className="button"
                style={{ background: '#673ab7' }}
                onClick={handleMint}
                disabled={isPending}
              >
                {isPending ? 'جاري السك...' : 'Mint as Capsule'}
              </button>
              {isSuccess && <p>✅ تم سك الكبسولة بنجاح!</p>}
            </>
          ) : (
            <>
              <p>🔐 الرجاء الاتصال بمحفظتك للمتابعة</p>
              <ConnectButton />
            </>
          )}
        </>
      ) : (
        <p>⚠️ لم يتم تحديد اسم المشروع.</p>
      )}
    </section>
  )
}

