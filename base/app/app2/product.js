export default function Product({seo}) {
  return <div>/product in app2 + {seo.title}</div>
}

export async function getServerSideProps () {
    return {
        props: {
            seo: {
                title: 'Vova title',
                keywords: 'Vova keywords',
                description: 'Vova description'
            }
        }
    }
}
