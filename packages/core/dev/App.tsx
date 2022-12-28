import { ComponentProps, splitProps } from "solid-js";

import { Button, Dialog, I18nProvider } from "../src";

function MyDialog(props: ComponentProps<typeof Dialog> & { level: number }) {
  const [local, others] = splitProps(props, ["children", "level"]);

  return (
    <Dialog {...others}>
      <Dialog.Trigger class="button" id={`${others.id}-trigger`}>
        {others.isModal ? "Open Modal" : "Open Non Modal"} {local.level}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Positioner style={{ overflow: "auto", "max-height": "500px" }}>
          <Dialog.Content class="popover">
            <Dialog.Title class="heading">Team meeting</Dialog.Title>
            <Dialog.Description>
              We are going to discuss what we have achieved on the project.
            </Dialog.Description>
            <div>
              <p>12 Jan 2022 18:00 to 19:00</p>
              <p>Alert 10 minutes before start</p>
            </div>
            <Button class="button">Accept {local.level}</Button>
            {local.children}
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Portal>
    </Dialog>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <div>
        <MyDialog id="non-modal-1" isModal={false} level={1}>
          <MyDialog id="non-modal-2" isModal={false} level={2}>
            <MyDialog id="non-modal-3" isModal={false} level={3} />
          </MyDialog>
        </MyDialog>
        <MyDialog id="modal-1" isModal={true} level={1}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem dicta facere inventore
            nihil repudiandae. At hic incidunt neque quas ut! Accusamus atque deserunt dolore, earum
            eum ipsam nesciunt quam quia quidem tenetur velit, voluptas voluptatibus voluptatum.
            Dolorem dolorum nulla voluptatibus. Accusantium adipisci alias amet at ea eius, impedit
            incidunt laborum voluptates? Asperiores dicta dolor doloribus earum, enim eum eveniet
            fuga illo incidunt iste magnam minima molestias mollitia officiis placeat porro quam
            quidem recusandae rem saepe, sint tenetur ullam voluptatum? Architecto autem
            exercitationem laborum laudantium possimus quidem quisquam similique! Ad consectetur,
            dolor doloremque et facilis maxime mollitia, neque omnis porro quidem ratione reiciendis
            repellat reprehenderit repudiandae rerum voluptas voluptates. Dignissimos expedita fugit
            harum ipsa laudantium, voluptatum. Ad distinctio ducimus eaque ex, explicabo id iste
            itaque laudantium mollitia non perferendis sed soluta tempora temporibus totam voluptas
            voluptatibus. Accusantium consectetur, culpa cum cumque expedita fuga libero maxime
            nostrum quas quo quod ratione reiciendis repellendus, sint vel? Ab ad adipisci aliquam
            aliquid at aut consequatur distinctio dolore esse eveniet facere harum inventore ipsa
            ipsum libero, nemo neque nesciunt nihil nisi nobis nostrum numquam officia quam quas
            quasi qui quisquam, reiciendis sed sint sunt suscipit tempore vel voluptatum! Corporis
            dicta eligendi eos facilis, illo iste iusto laborum officia perspiciatis rem rerum saepe
            temporibus ullam veniam voluptatum! Alias assumenda blanditiis debitis dolor, dolore
            eius error mollitia nam necessitatibus, nemo officia, optio porro rerum saepe sint!
            Facilis nesciunt nihil nostrum pariatur repellat repudiandae saepe, velit voluptatibus?
            Aspernatur aut culpa dicta ducimus eligendi possimus provident quia? Accusantium fuga
            magnam neque quos recusandae saepe sequi similique. Aliquid dicta dignissimos eum
            expedita fuga hic ipsam laudantium minima modi mollitia, nihil, nobis possimus quaerat
            quam quibusdam quod repellat soluta temporibus unde, ut veritatis voluptatem
            voluptatibus voluptatum. Aut deserunt enim expedita impedit incidunt libero magnam
            numquam quam quis sapiente. Eos impedit sint veritatis voluptas? Fuga, minus, provident.
            Accusamus ad adipisci at culpa cumque, delectus dignissimos iusto minima minus modi
            mollitia non quos rerum tenetur, ut voluptate voluptatum. Corporis earum et fugit iure
            unde veniam vitae? Consectetur hic iste nesciunt nulla, odio quam quas quisquam quos
            voluptate voluptatibus. Adipisci, ducimus, suscipit. Dolor doloribus, dolorum inventore
            itaque optio sed unde! A aliquid animi blanditiis consequuntur cum, deleniti dolor
            expedita fugit hic minima molestiae necessitatibus nobis quibusdam rem repellendus
            sapiente suscipit vero? Alias, aliquam animi assumenda aut consequuntur cumque
            dignissimos enim est fugiat impedit inventore ipsam itaque magnam nesciunt nostrum
            quidem, quos sequi veniam voluptates voluptatibus! Accusantium adipisci alias asperiores
            atque blanditiis consequatur cumque deleniti deserunt doloremque doloribus error
            exercitationem expedita fuga magnam modi natus neque qui quidem quo quod, repellendus
            rerum unde, ut veniam veritatis? Ab adipisci alias aspernatur assumenda beatae
            blanditiis culpa dolorum eligendi est explicabo illo, ipsam labore laboriosam laborum
            libero magni mollitia neque non nostrum nulla optio praesentium quam quisquam ratione
            repellendus saepe sed ullam ut veniam voluptatibus. Ab aperiam asperiores atque commodi
            culpa cum cumque, dignissimos distinctio dolorem doloremque dolores dolorum eius error
            ex excepturi expedita fuga fugit hic magni minima nisi nostrum, odio odit omnis quae
            quas quia quidem quis quos recusandae reiciendis rem repellat repellendus, temporibus
            tenetur ullam ut! Dignissimos et ex libero recusandae. Ad aliquam aliquid animi aperiam
            assumenda, at commodi consectetur debitis distinctio doloremque enim eos error est,
            facilis fugiat fugit illo incidunt labore magnam maxime necessitatibus nostrum nulla
            numquam officia perferendis quia saepe sapiente sint sit sunt! Alias consequatur
            incidunt maiores, mollitia nam necessitatibus odit quo recusandae sed ut? Ad amet
            asperiores assumenda aut consectetur delectus dolor doloremque dolores exercitationem
            fugit iure laudantium minima, modi nam nisi perferendis placeat quisquam, reprehenderit,
            repudiandae sint vitae voluptates voluptatum. Ab adipisci aperiam architecto assumenda
            at, autem consequuntur cum debitis deleniti ea eaque earum eligendi excepturi, harum id
            impedit laboriosam maiores minus non numquam odio officiis optio pariatur quaerat quasi,
            quia quibusdam recusandae reiciendis repudiandae rerum sequi similique sunt tenetur
            totam vel voluptas voluptate! Deserunt, doloribus ducimus eos, et exercitationem maxime
            necessitatibus nemo quia quo repellendus sit ullam. Accusamus aperiam architecto
            asperiores assumenda beatae cum deleniti deserunt doloribus dolorum eaque esse est harum
            in inventore ipsam iste laboriosam laborum, neque nobis nulla officiis possimus quae
            quia quibusdam reiciendis repellat reprehenderit repudiandae sit tempore temporibus
            tenetur velit voluptate voluptatibus. Aperiam dolor eius eligendi facere! Animi autem
            eum facilis ipsam, magnam nemo temporibus totam? Alias aliquam autem blanditiis
            consectetur corporis cum cupiditate deleniti, distinctio dolores enim exercitationem
            harum incidunt ipsam ipsum libero neque, nesciunt nihil, nobis nulla officia omnis porro
            quibusdam quis quo reiciendis repellendus tenetur ut veniam vero voluptatem. Ad at
            blanditiis commodi, dicta hic ipsum laborum laudantium minus nemo perferendis placeat
            quam! Aliquam blanditiis deserunt ducimus, ea fuga impedit ipsa laborum praesentium,
            quod sint sit totam voluptate. Deserunt doloremque earum impedit ipsum iusto mollitia
            non, odio possimus quam quasi quis temporibus ullam vel? Aliquam animi commodi
            consequatur corporis eaque eveniet illum molestiae nam provident qui quia quo
            repellendus sint totam, veritatis. A alias aliquid asperiores consequatur delectus
            distinctio esse inventore ipsam magnam maxime nihil nostrum officia, perspiciatis porro
            sequi, sunt vel. A, at cumque doloribus eaque earum eum exercitationem facere id iste,
            modi odit, placeat porro possimus quia repellendus suscipit voluptas. Animi aspernatur
            atque distinctio doloremque et nesciunt sapiente voluptates. Asperiores debitis
            repellendus suscipit. Accusantium adipisci assumenda atque, cumque earum eveniet
            excepturi id nesciunt quas quasi quod similique sint sit, tempore ut. Architecto beatae
            culpa dicta dignissimos eaque et facilis hic illo, maiores modi mollitia, nam nesciunt
            non odit repellendus, voluptas voluptatum. Amet aperiam debitis distinctio libero,
            maiores maxime nemo neque, nulla officiis quae quaerat sed, veniam. Architecto,
            corporis, dolorum eius eligendi explicabo hic id maxime minima minus nostrum porro quasi
            qui quia quidem veritatis vitae voluptatum. Adipisci aliquid asperiores atque blanditiis
            consectetur consequatur culpa cum deleniti deserunt distinctio dolor doloribus earum et
            eveniet facilis illum impedit ipsa ipsam iste itaque laboriosam laudantium libero
            magnam, magni maiores nemo nihil provident rem, repellat reprehenderit sapiente tempore
            vitae voluptatibus. Atque commodi cum deserunt distinctio dolorum earum eligendi eum hic
            id itaque labore laudantium magnam maxime molestias nemo omnis optio placeat repellendus
            rerum sed sequi sit, sunt suscipit ut veritatis vitae voluptas.
          </p>
          <MyDialog id="modal-2" isModal={true} level={2}>
            <MyDialog id="modal-3" isModal={true} level={3} />
          </MyDialog>
        </MyDialog>
        <button class="button" onClick={() => console.log("external button triggered")}>
          Outside
        </button>
      </div>
    </I18nProvider>
  );
}
