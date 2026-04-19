const WHATSAPP_NUMBER = '918427182071'
const WHATSAPP_MESSAGE = encodeURIComponent("Hi Shueki Tech! I visited your website and I'm interested in your services. Can we connect?")
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-[#25D366] hover:bg-[#1ebe57] transition-transform hover:scale-110 active:scale-95"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-8 h-8 fill-white"
      >
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.472 2.027 7.773L0 32l8.489-2.001A15.928 15.928 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.258 13.258 0 0 1-6.766-1.852l-.485-.29-5.037 1.187 1.215-4.904-.317-.503A13.227 13.227 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.273-9.878c-.398-.199-2.355-1.163-2.72-1.295-.366-.133-.632-.199-.898.199s-1.031 1.295-1.264 1.561c-.232.266-.465.299-.863.1-.398-.199-1.681-.619-3.202-1.977-1.183-1.056-1.982-2.36-2.214-2.758-.232-.398-.025-.613.174-.811.179-.178.398-.465.597-.698.199-.232.266-.398.399-.664.133-.266.066-.499-.033-.698-.1-.199-.898-2.166-1.231-2.965-.324-.778-.653-.673-.898-.686l-.765-.013c-.266 0-.698.1-1.064.499-.366.398-1.397 1.365-1.397 3.328s1.43 3.86 1.629 4.126c.2.266 2.814 4.298 6.817 6.027.953.411 1.696.657 2.275.841.955.304 1.825.261 2.512.158.766-.114 2.355-.963 2.688-1.893.332-.93.332-1.728.232-1.893-.099-.166-.365-.266-.763-.465z" />
      </svg>
    </a>
  )
}
