import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { linkbioService } from '@/services/linkbioService';
import { useToast } from '@/hooks/use-toast';

const predefinedColors = {
  background: [
    { name: 'Escuro', value: '#1a1a1a' },
    { name: 'Preto', value: '#000000' },
    { name: 'Cinza Escuro', value: '#2d2d2d' },
    { name: 'Azul Escuro', value: '#1e293b' },
    { name: 'Verde Escuro', value: '#14532d' },
  ],
  button: [
    { name: 'Verde', value: '#00d632' },
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Roxo', value: '#8b5cf6' },
    { name: 'Rosa', value: '#ec4899' },
    { name: 'Laranja', value: '#f97316' },
  ]
};

export function Customization() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [backgroundColor, setBackgroundColor] = useState('#1a1a1a');
  const [buttonColor, setButtonColor] = useState('#00d632');

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: linkbioService.getProfile,
  });

  useEffect(() => {
    if (profile) {
      setBackgroundColor(profile.backgroundColor);
      setButtonColor(profile.buttonColor);
    }
  }, [profile]);

  const updateProfileMutation = useMutation({
    mutationFn: (updates: { backgroundColor: string; buttonColor: string }) =>
      linkbioService.updateProfile(updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Personalização salva",
        description: "Suas cores foram atualizadas com sucesso.",
      });
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate({ backgroundColor, buttonColor });
  };

  const ColorPicker = ({ 
    label, 
    value, 
    onChange, 
    colors 
  }: { 
    label: string; 
    value: string; 
    onChange: (color: string) => void; 
    colors: Array<{ name: string; value: string }>
  }) => (
    <div className="space-y-3">
      <Label className="text-linkbio-text font-medium">{label}</Label>
      
      {/* Color Input */}
      <div className="flex items-center gap-3">
        <div 
          className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer"
          style={{ backgroundColor: value }}
          onClick={() => document.getElementById(`color-${label}`)?.click()}
        />
        <Input
          id={`color-${label}`}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 h-12 p-1 bg-linkbio-sidebar border-border cursor-pointer"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1 bg-linkbio-sidebar border-border text-linkbio-text"
        />
      </div>

      {/* Predefined Colors */}
      <div className="grid grid-cols-5 gap-2">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onChange(color.value)}
            className="group relative"
          >
            <div 
              className="w-full h-12 rounded-lg border-2 transition-all hover:scale-105"
              style={{ 
                backgroundColor: color.value,
                borderColor: value === color.value ? '#00d632' : 'transparent'
              }}
            />
            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-linkbio-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
              {color.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-linkbio-text">Personalização</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Color Settings */}
        <Card className="bg-linkbio-card border-border p-6">
          <div className="space-y-8">
            <ColorPicker
              label="Cor de Fundo"
              value={backgroundColor}
              onChange={setBackgroundColor}
              colors={predefinedColors.background}
            />

            <ColorPicker
              label="Cor dos Botões"
              value={buttonColor}
              onChange={setButtonColor}
              colors={predefinedColors.button}
            />

            <Button 
              onClick={handleSave}
              disabled={updateProfileMutation.isPending}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {updateProfileMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </Card>

        {/* Preview */}
        <Card className="bg-linkbio-card border-border p-6">
          <h3 className="text-lg font-medium text-linkbio-text mb-4">Prévia</h3>
          
          <div 
            className="p-6 rounded-2xl border-2 border-border"
            style={{ backgroundColor }}
          >
            {/* Profile Preview */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-300 mx-auto mb-3" />
              <h4 className="font-bold text-white">@{profile?.username || 'usuario'}</h4>
              <p className="text-gray-300 text-sm">{profile?.displayName || 'Criador de conteúdo'}</p>
            </div>

            {/* Button Preview */}
            <div className="space-y-3">
              <div 
                className="w-full h-12 rounded-lg flex items-center justify-center font-medium text-white"
                style={{ backgroundColor: buttonColor }}
              >
                Instagram
              </div>
              <div 
                className="w-full h-12 rounded-lg flex items-center justify-center font-medium text-white"
                style={{ backgroundColor: buttonColor }}
              >
                YouTube
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tips */}
      <Card className="bg-linkbio-sidebar border-border p-4">
        <h3 className="font-medium text-linkbio-text mb-2">Dicas de Personalização</h3>
        <ul className="text-sm text-linkbio-text-muted space-y-1">
          <li>• Use cores contrastantes para melhor legibilidade</li>
          <li>• Teste as cores em diferentes dispositivos</li>
          <li>• Mantenha consistência com sua marca pessoal</li>
          <li>• Cores escuras no fundo facilitam a leitura</li>
        </ul>
      </Card>
    </div>
  );
}