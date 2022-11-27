import { Dialog } from "../src";
import { createSignal } from "solid-js";

export default function App() {
  const [opened, setOpened] = createSignal(false);

  return (
    <>
      <Dialog isOpen={opened()} onOpenChange={setOpened}>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Backdrop class="fixed inset-0 bg-black bg-opacity-25" />
          <Dialog.Container class="fixed inset-0 flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel class="flex flex-col w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title class="text-lg font-medium leading-6 text-gray-900">
                Payment successful
              </Dialog.Title>
              <Dialog.Description class="mt-2 text-sm text-gray-500">
                Your payment has been successfully submitted. We’ve sent you an email with all of
                the details of your order.
              </Dialog.Description>
              <Dialog.CloseButton class="mt-4 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                Got it, thanks!
              </Dialog.CloseButton>
            </Dialog.Panel>
          </Dialog.Container>
        </Dialog.Portal>
      </Dialog>
      <br />
      <p>{opened() ? "opened" : "closed"}</p>
      <br />
      <button onClick={() => setOpened(true)}>Open</button>
      <br />
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam amet blanditiis cupiditate
        deserunt facilis molestias nam nemo nihil odit provident quisquam, quod ratione repellendus,
        sunt vitae. Amet aspernatur consectetur cum delectus dicta dignissimos dolore doloremque
        doloribus ducimus ea eaque, eligendi ex fugit harum illo iste itaque iure libero magni nobis
        nostrum obcaecati officia omnis, optio pariatur porro possimus quaerat quo quod ratione
        reiciendis rem repudiandae, similique suscipit totam ullam voluptatem! Ea enim
        exercitationem ipsam molestiae placeat sunt veniam? A ab adipisci architecto aut commodi
        cupiditate dicta dignissimos dolorem earum fugiat iste molestiae nulla, numquam omnis
        ratione recusandae sapiente sunt! Accusantium adipisci debitis enim ex facere in iusto
        molestiae, perspiciatis placeat ut, voluptatem, voluptatibus. Dolore illo nulla quo sequi
        vel? A ab accusantium ad amet aperiam architecto consectetur debitis dolore dolores, eius
        eos et facilis fuga id illum iste magni mollitia necessitatibus neque nobis non officia
        officiis perferendis placeat porro praesentium quae quaerat quam quo recusandae sequi sint
        sunt tempore ut vel vitae voluptates. Ab asperiores aut debitis, deserunt eaque error eum ex
        fugit ipsa nemo numquam obcaecati possimus quaerat quia rem tempora ut. Aut quia repellat
        sequi. Ab, aliquam aperiam asperiores corporis dicta dolores eaque eligendi est ex expedita
        hic incidunt ipsum minus modi molestias natus nemo, quam quibusdam quidem ratione reiciendis
        repellendus saepe sint tempore tenetur totam voluptas voluptates. Blanditiis distinctio eum
        ex fugit ipsum nulla officia omnis porro quibusdam, rem repudiandae saepe sequi sunt,
        tempore veniam. Aliquam cumque deleniti, fugit inventore labore, maiores maxime nam, nostrum
        quasi quia sequi sint sit voluptas. Ab alias aut, corporis culpa debitis doloremque ducimus
        eaque harum inventore, itaque laudantium magni, minima molestias mollitia nam nisi
        perferendis quas quia rerum ut. Accusantium amet dolor dolorem fugit magni molestias quidem
        sapiente, suscipit. Adipisci alias aliquam animi architecto, atque, delectus dignissimos
        dolores ea eius error esse et eum facere ipsam itaque iure magnam obcaecati officiis
        pariatur placeat quam quis recusandae reiciendis sequi unde voluptates voluptatibus.
        Architecto assumenda, deleniti dolores, eos et explicabo harum iste, laudantium magni
        maiores molestias non optio provident quam quibusdam quisquam recusandae rerum sunt totam
        vel? Nam nisi nobis sit? Fugit iste odio quas quibusdam quis similique vel vitae. Commodi
        culpa eius est eveniet iusto labore minus nisi perspiciatis ratione tempore. Architecto
        distinctio, dolor excepturi odit quam sequi soluta totam? Accusamus culpa doloribus expedita
        magnam minima officiis porro quae quod repellat reprehenderit? Aspernatur aut doloremque
        incidunt suscipit? Aspernatur cumque earum iure minima sint vero voluptatum! Autem
        blanditiis eius enim ex laudantium numquam quaerat quisquam soluta? A accusamus amet
        cupiditate enim officia possimus quo! Accusamus alias amet asperiores at atque blanditiis
        consectetur cum cupiditate distinctio, eaque eius est excepturi facilis harum illo ipsa
        ipsum laborum nam, neque officiis praesentium quae quam quidem quisquam totam ullam vitae
        voluptatibus. Blanditiis consequatur earum eius error iure minus nihil nisi nostrum quasi,
        qui ratione suscipit tempore? Alias amet assumenda, delectus esse exercitationem fugit illo
        iste laboriosam nobis nulla, officia perspiciatis provident quasi quia quos rerum sapiente
        sequi soluta unde voluptates? Adipisci amet corporis debitis dolore est, eum impedit
        incidunt ipsa laborum magnam neque nihil nulla, omnis, optio quaerat quidem sint unde! Ad
        aliquam culpa dignissimos dolorum et laborum necessitatibus nemo provident repellat
        suscipit. Deleniti modi, molestiae nihil perferendis possimus ratione vel. Aliquid dicta
        distinctio eligendi error exercitationem facere fuga hic id in ipsa iste iusto odit,
        perferendis provident ratione, repudiandae sed tenetur! Eos esse illo ipsum voluptates.
        Consectetur est excepturi quae quaerat sequi, vero voluptatum? Adipisci aliquid amet animi
        beatae commodi, dolor ducimus, esse facere facilis fuga fugiat incidunt minima minus
        mollitia nam natus nostrum numquam officia porro qui quidem quisquam quo rem vel vero, vitae
        voluptas voluptate! A esse iure mollitia, optio quae quas quos? Ad adipisci animi, aperiam
        cum, est expedita facilis ipsum iure obcaecati officia optio perferendis placeat quibusdam
        quo repellat rerum sed tempore veritatis voluptas voluptatibus. Adipisci animi, aperiam
        cupiditate deleniti dolores fuga harum id illo magni molestiae mollitia neque nihil non
        nostrum pariatur porro qui quis ratione reiciendis repellendus rerum sequi, similique sint
        suscipit temporibus, veniam vitae voluptatibus. Adipisci aut autem blanditiis consequuntur
        cum, impedit iste laudantium minima molestias nesciunt non pariatur possimus sed, totam, ut
        velit voluptatibus. Amet aspernatur, assumenda aut beatae deserunt doloribus eius, eligendi
        illo illum incidunt ipsa ipsum iusto, nulla omnis pariatur quaerat quisquam quo rem
        reprehenderit repudiandae sint tempora voluptatem. Commodi culpa doloremque eligendi est
        eveniet facere id iusto labore, quas quis sequi suscipit ullam vel! Assumenda beatae
        corporis distinctio ducimus eaque facere fugiat modi odit omnis, velit. Amet architecto
        atque consequatur cum dolore dolorum eaque et exercitationem facere facilis fuga illum in
        ipsa iste necessitatibus neque numquam omnis, optio perferendis quae quam quia repellat
        reprehenderit similique velit veniam voluptates? Animi consequuntur dignissimos ex illum
        incidunt ipsa iusto, nemo sapiente tenetur veniam. Ad alias aliquam amet architecto corporis
        culpa dicta dolorum enim eum eveniet illum iste modi, neque odio omnis optio perferendis
        perspiciatis ratione rem sunt tenetur ullam vero? Corporis est facilis nostrum odit optio
        quod saepe? Accusamus culpa earum et facere illo labore, modi quo, rem, reprehenderit saepe
        temporibus vero voluptate voluptatum! Aperiam debitis dolor, facilis fugit iste nihil quia
        sunt totam! Eligendi facilis magni mollitia vel. A animi aperiam asperiores blanditiis
        corporis, deserunt ea est illum laboriosam odit possimus quam quo, repellat saepe ullam
        vero, voluptatum. At cupiditate doloremque dolorum eos ex? Ab accusamus aliquid, amet
        aperiam, consequatur dolorem dolores ducimus est fugit illum incidunt laboriosam nemo
        pariatur quis ratione recusandae repudiandae rerum similique sunt tempore! Amet distinctio
        ea error incidunt voluptas. Architecto excepturi harum illum ipsum quam quas quod!
        Architecto asperiores corporis iure iusto nostrum officia sed! Architecto asperiores at aut,
        deleniti dolorem dolorum ducimus ea eum excepturi hic illum in ipsa labore magni maiores
        minus necessitatibus nesciunt nostrum nulla numquam pariatur provident quibusdam quo quod
        reiciendis rerum sapiente similique sit voluptates voluptatibus. Adipisci aliquid aspernatur
        assumenda autem culpa cupiditate deserunt distinctio esse, est ex id maiores nostrum optio
        quas qui quis quo rem repudiandae sit sunt suscipit tempora tempore? Ab cum exercitationem
        inventore ipsum necessitatibus officia officiis quam quo rerum similique? Beatae cumque
        incidunt iusto mollitia provident voluptatem! Assumenda at atque cum debitis dolorem
        eligendi eveniet, impedit laborum maiores minima necessitatibus nostrum numquam officia
        omnis quasi, quod ratione veritatis vitae. Dignissimos in maxime nostrum quasi tempora ullam
        vero voluptate voluptates! Accusamus, ad aspernatur at consectetur eos explicabo facere, in
        quos ratione repellat, sit voluptatibus. Amet animi culpa cumque debitis delectus dolorem
        doloremque earum eligendi eveniet facilis fugiat hic magni necessitatibus nemo nesciunt odit
        omnis optio quas quia quidem quod sed sint sunt totam ullam, vitae voluptates! A autem
        commodi cum pariatur quidem quisquam ratione, repellat tenetur? Asperiores beatae blanditiis
        enim nostrum pariatur repudiandae vitae. Aliquid atque eius, eveniet harum laborum
        perspiciatis quasi voluptate! Accusantium deserunt harum ipsa itaque iusto laudantium nulla
        praesentium voluptatibus! Culpa dolor eaque facere iste quas. In iste numquam officiis
        recusandae similique voluptatem. Atque, beatae commodi eum exercitationem harum iste
        molestias natus praesentium rem repellat reprehenderit sed. Accusamus aliquid animi at
        delectus ducimus, exercitationem explicabo fugiat illum impedit iste laudantium magni minus
        officiis provident quasi, quia sint ut veniam veritatis voluptas. Ab, aspernatur autem
        dolore doloribus expedita explicabo illum, laudantium libero maiores modi natus nesciunt
        pariatur perferendis quis repudiandae saepe soluta. Aut laboriosam officia voluptatibus.
        Accusamus ad est facilis iusto possimus voluptatum. Adipisci assumenda dignissimos dolor est
        eveniet excepturi, iure laboriosam laudantium nulla obcaecati odit, porro quasi sequi
        tempora tenetur voluptatem voluptates voluptatibus. Accusantium ad, blanditiis cum ducimus
        esse ipsa iure odit optio praesentium sequi sint tenetur vel veniam vitae voluptas! A
        adipisci amet beatae culpa cum debitis, distinctio dolore doloribus ducimus enim eos error
        ex fuga fugiat harum impedit incidunt ipsa ipsam itaque iure iusto labore magnam minima
        necessitatibus nisi officia officiis perferendis quae tempore temporibus totam ullam vel,
        voluptatum! A ad animi aperiam beatae blanditiis cupiditate deserunt dicta distinctio,
        dolore dolores enim fugiat illo ipsum magnam necessitatibus numquam officiis optio pariatur
        provident quasi, qui quibusdam quo quod quos similique, temporibus vel voluptatibus! Amet
        dicta iusto laborum magni nam provident qui quidem veniam? Expedita fugit minus molestiae
        nihil obcaecati quasi, vel. A ab accusamus accusantium amet aperiam architecto beatae
        consequuntur corporis culpa debitis doloremque doloribus ducimus ea esse et id illo
        inventore ipsa labore laboriosam molestias necessitatibus, neque nobis nulla numquam optio
        praesentium provident quis quo reprehenderit sequi sint sit tempora tempore velit veniam
        voluptate. Accusamus amet asperiores, at consequatur earum ex iusto laudantium minus,
        mollitia natus nisi officiis optio porro ratione rem similique sit soluta voluptate! A
        accusantium beatae, debitis dolor dolores earum esse eum facere hic in inventore iure
        laborum maxime perferendis quibusdam veniam voluptate. Dicta hic ipsa iste provident.
        Accusamus adipisci alias aliquid atque aut consectetur dolores eum expedita facere facilis
        fugit harum illum modi mollitia nobis odit officiis, omnis perferendis quas quibusdam
        similique tempore temporibus voluptates! Ad asperiores assumenda at debitis dolor doloremque
        error, eum ex excepturi hic id inventore iste itaque labore libero magni maxime modi
        molestias mollitia nam nesciunt non odio odit pariatur quam ratione repellendus sapiente
        similique sint tempora totam vero voluptatem, voluptates? Magnam nihil odit provident quia
        vero. Ad aliquam atque consectetur deleniti ea facere facilis, fugiat hic iusto laboriosam
        magnam minima, nemo quod repellendus rerum sequi totam, vel voluptatibus! Aliquam aliquid
        asperiores assumenda aut cum delectus doloribus ipsa ipsam labore non placeat quae quas
        quia, repellat rerum veniam voluptates? Aliquam, iste, voluptate. Alias animi dignissimos
        error eum molestiae quisquam reiciendis voluptatum. Aliquid atque beatae delectus tempore?
        Accusantium commodi consequatur, corporis dolorem excepturi fugiat magnam minus neque non
        quidem quos recusandae, reprehenderit ullam. A ad aliquid amet aperiam architecto assumenda
        blanditiis consequatur consequuntur corporis debitis deserunt dolorem doloribus ducimus ea
        earum eos esse eveniet excepturi explicabo id ipsum, magni, mollitia neque nisi nobis
        numquam obcaecati odit quas quidem ratione reprehenderit sapiente, sed soluta suscipit
        tempora vero voluptatum. Ab alias animi aperiam beatae deleniti dolores, ea eligendi eum
        exercitationem iste nemo odit praesentium quae repellat, sed, sint sunt tenetur ut?
        Explicabo fugit iure nemo odit voluptas? Ex nulla quod sequi. A aspernatur at culpa, dolores
        ducimus ea id illo in inventore iusto minima molestiae neque officiis omnis pariatur placeat
        porro provident, qui quod quos saepe sapiente sint totam! Ad aliquid animi at eaque itaque
        maiores quasi recusandae repudiandae ut. Commodi, error velit? Aliquid beatae debitis
        delectus explicabo facilis ipsam nihil possimus sapiente voluptatem voluptatum? Ab adipisci
        amet aspernatur beatae commodi cumque dolorem dolores doloribus dolorum ea eaque eos, et,
        explicabo facilis fuga fugit id iure laboriosam libero modi, nam necessitatibus nisi nostrum
        officiis omnis perspiciatis possimus quas quasi quisquam recusandae rem repudiandae sapiente
        sunt tempora tempore vitae voluptatum. A aliquam, atque blanditiis dicta distinctio eos est
        fuga fugiat illum incidunt inventore ipsum laboriosam maiores, minima, officiis perferendis
        quia quibusdam quisquam soluta sunt velit vero voluptas. Accusamus alias asperiores
        assumenda commodi consequatur corporis cumque, debitis dolore doloribus, eaque eligendi est
        ex explicabo fuga harum id ipsum itaque iure minima molestias nisi obcaecati perferendis
        placeat possimus provident quisquam recusandae reiciendis repellat sit suscipit totam ullam
        veritatis, voluptate. A debitis dolores ipsum nemo quisquam quos, recusandae repellat vitae.
        Accusamus deleniti ipsum libero odio soluta totam? Amet aspernatur consectetur deserunt
        exercitationem illum nesciunt quis reprehenderit, sit ullam vero! Ab aliquid consectetur
        cumque earum expedita, nemo nihil? Aliquam, dolor dolorum illum itaque laudantium modi
        quibusdam quo! Aperiam architecto atque cumque dolor fugiat ipsum quae quo. A accusamus ad
        architecto aut autem ea est, id in magnam necessitatibus, quaerat, tempora temporibus vitae!
        Ab eum inventore ipsum libero non quibusdam quod rerum vero! Animi ipsum labore nostrum odio
        possimus. Eos facilis ipsa laboriosam nobis. Accusantium dignissimos hic nesciunt numquam
        omnis perferendis perspiciatis possimus quaerat rerum vero. Deleniti deserunt est
        necessitatibus provident quaerat ratione tenetur unde ut! Ab ad aliquid, architecto
        asperiores assumenda at beatae culpa cum cupiditate dignissimos dolorem eaque earum error,
        eveniet hic illum incidunt inventore, ipsum laborum magnam nostrum officia placeat
        praesentium quod quos recusandae rem repellat temporibus veniam voluptas. Ad animi
        architecto consectetur consequuntur cumque debitis doloremque illum ipsam magnam molestias
        nam odit omnis quas quia, quod saepe tempora veritatis voluptatibus! Ad dolore eligendi
        ipsum itaque libero, magni, minima mollitia necessitatibus nostrum saepe similique sint
        temporibus.
      </p>
    </>
  );
}
