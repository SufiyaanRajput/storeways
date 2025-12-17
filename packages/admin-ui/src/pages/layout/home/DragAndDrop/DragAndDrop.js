import { DndContext, useDroppable, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { verticalListSortingStrategy, SortableContext, useSortable, arrayMove } from "@dnd-kit/sortable";
import { Button, Select, Drawer } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import SectionForm from "./SectionForm/SectionForm";
import { Card, ItemCard, AddSectionCard } from "./styles";
import { useState } from "react";

const Item = (props) => {
  const { id, updateItemParent, setSectionToEdit, item } = props;

  const removeItem = () => {
    updateItemParent(false, { id });
  };

  return (
    <ItemCard id={id}>
      <p>{item.id}</p>
      <div>
        <Button onClick={() => setSectionToEdit(item)}>
          <FontAwesomeIcon icon={faEdit} />
        </Button>
        <Button onClick={removeItem}>
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </div>
    </ItemCard>
  );
};

const SortableItem = (props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });

  const style = {
    ...(transform
      ? {
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
      : {}),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Item
        id={props.item.key}
        item={props.item}
        updateItemParent={props.updateItemParent}
        setSectionToEdit={props.setSectionToEdit}
      />
    </div>
  );
};

const Container = ({ id, items, updateItemParent, setSectionToEdit }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <SortableContext id={id} items={items.map(({ key }) => key)} strategy={verticalListSortingStrategy}>
      <div ref={setNodeRef} id={id}>
        {items.map((item) => (
          <SortableItem
            key={item.key}
            id={item.key}
            item={item}
            updateItemParent={updateItemParent}
            setSectionToEdit={setSectionToEdit}
          />
        ))}
      </div>
    </SortableContext>
  );
};

const DragAndDrop = ({
  items,
  setItems,
  refetchLayout,
  updateLayoutSection,
  uploadBannerImage,
  uploadPosterImage,
}) => {
  const [sectionToEdit, setSectionToEdit] = useState(null);
  const sections = ["CAROUSEL", "BANNER", "POSTERS", "PRODUCTS", "FEATURES", "NEWSLETTER", "BLOG"];
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const updateItemParent = (selected, active) => {
    setItems((items) =>
      items.filter((item) => {
        if (item.key !== active.id) return true;
        return selected;
      })
    );
  };

  const handleDragEnd = (event) => {
    const { over, active } = event;

    if (over && over.id === active.id) return;

    if (over && over.id) {
      const oldIndex = items.findIndex((item) => item.key === active.id);
      const newIndex = items.findIndex((item) => item.key === over.id);
      const newItemsArray = arrayMove(items, oldIndex, newIndex);
      setItems([...newItemsArray]);
    }
  };

  const onSelectNewSection = (id) => {
    setItems((items) => [...items, { id, key: id + "_" + Math.random().toString(16).slice(2) }]);
  };

  return (
    <>
      <Drawer
        title="Edit section"
        placement="right"
        closable
        onClose={() => setSectionToEdit(null)}
        open={Boolean(sectionToEdit)}
        size="large"
        destroyOnClose
      >
        <SectionForm
          section={sectionToEdit}
          setSectionToEdit={setSectionToEdit}
          refetchLayout={refetchLayout}
          updateLayoutSection={updateLayoutSection}
          uploadBannerImage={uploadBannerImage}
          uploadPosterImage={uploadPosterImage}
        />
      </Drawer>
      <Card>
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <Container id="selected" items={items} updateItemParent={updateItemParent} setSectionToEdit={setSectionToEdit} />
        </DndContext>
        <AddSectionCard>
          <Select onChange={onSelectNewSection} value={null} placeholder="Add new">
            {sections.map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </AddSectionCard>
      </Card>
    </>
  );
};

export default DragAndDrop;


