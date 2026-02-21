import { Input } from '@/components/ui';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="w-full mb-4">
      <Input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Buscar por nome ou nome de usuário"
        className="w-full"
      />
    </div>
  );
}
