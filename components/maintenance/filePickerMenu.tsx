import * as DropdownMenu from "zeego/dropdown-menu";

export type Props = {
  items: Array<{
    key: string;
    title: string;
  }>;
  onSelect: (key: string) => void;
  trigger: React.ReactNode;
};

export default function FilePickerMenu({ items, onSelect, trigger }: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>{trigger}</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {items.map((item) => (
          <DropdownMenu.Item key={item.key} onSelect={() => onSelect(item.key)}>
            {item.title}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
