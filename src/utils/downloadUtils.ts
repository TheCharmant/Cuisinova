import jsPDF from 'jspdf';
import { ExtendedRecipe } from '../types';

/**
 * Download recipe as plain text file
 */
export const downloadRecipeAsTXT = (recipe: ExtendedRecipe) => {
    const content = generateTextContent(recipe);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitizeFilename(recipe.name)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Download recipe as PDF file
 */
export const downloadRecipeAsPDF = (recipe: ExtendedRecipe) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    const titleLines = doc.splitTextToSize(recipe.name, maxWidth);
    doc.text(titleLines, pageWidth / 2, y, { align: 'center' });
    y += titleLines.length * 10 + 10;

    // Ingredients section
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Ingredients', margin, y);
    y += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    recipe.ingredients.forEach((ing) => {
        const line = `• ${ing.name}${ing.quantity ? ` (${ing.quantity})` : ''}`;
        const lines = doc.splitTextToSize(line, maxWidth);
        if (y > 280) {
            doc.addPage();
            y = margin;
        }
        doc.text(lines, margin, y);
        y += lines.length * 7 + 3;
    });

    y += 5;

    // Instructions section
    if (y > 250) {
        doc.addPage();
        y = margin;
    }

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Instructions', margin, y);
    y += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    recipe.instructions.forEach((instruction, idx) => {
        const line = `${idx + 1}. ${instruction}`;
        const lines = doc.splitTextToSize(line, maxWidth);
        if (y > 250) {
            doc.addPage();
            y = margin;
        }
        doc.text(lines, margin, y);
        y += lines.length * 7 + 3;
    });

    y += 5;

    // Additional Information
    const sections = [
        { title: 'Tips', content: recipe.additionalInformation?.tips },
        { title: 'Variations', content: recipe.additionalInformation?.variations },
        { title: 'Serving Suggestions', content: recipe.additionalInformation?.servingSuggestions },
        { title: 'Nutritional Information', content: recipe.additionalInformation?.nutritionalInformation },
    ];

    sections.forEach((section) => {
        if (!section.content) return;

        if (y > 220) {
            doc.addPage();
            y = margin;
        }

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(section.title, margin, y);
        y += 10;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        const lines = doc.splitTextToSize(section.content, maxWidth);
        if (y + lines.length * 7 > 280) {
            doc.addPage();
            y = margin;
        }
        doc.text(lines, margin, y);
        y += lines.length * 7 + 10;
    });

    // Save the PDF
    doc.save(`${sanitizeFilename(recipe.name)}.pdf`);
};

/**
 * Generate plain text content for the recipe
 */
function generateTextContent(recipe: ExtendedRecipe): string {
    const lines: string[] = [];

    lines.push(recipe.name.toUpperCase());
    lines.push('='.repeat(recipe.name.length));
    lines.push('');

    lines.push('INGREDIENTS');
    lines.push('-'.repeat(20));
    recipe.ingredients.forEach((ing) => {
        lines.push(`• ${ing.name}${ing.quantity ? ` - ${ing.quantity}` : ''}`);
    });
    lines.push('');

    lines.push('INSTRUCTIONS');
    lines.push('-'.repeat(20));
    recipe.instructions.forEach((instruction, idx) => {
        lines.push(`${idx + 1}. ${instruction}`);
    });
    lines.push('');

    if (recipe.additionalInformation?.tips) {
        lines.push('TIPS');
        lines.push('-'.repeat(20));
        lines.push(recipe.additionalInformation.tips);
        lines.push('');
    }

    if (recipe.additionalInformation?.variations) {
        lines.push('VARIATIONS');
        lines.push('-'.repeat(20));
        lines.push(recipe.additionalInformation.variations);
        lines.push('');
    }

    if (recipe.additionalInformation?.servingSuggestions) {
        lines.push('SERVING SUGGESTIONS');
        lines.push('-'.repeat(20));
        lines.push(recipe.additionalInformation.servingSuggestions);
        lines.push('');
    }

    if (recipe.additionalInformation?.nutritionalInformation) {
        lines.push('NUTRITIONAL INFORMATION');
        lines.push('-'.repeat(20));
        lines.push(recipe.additionalInformation.nutritionalInformation);
    }

    return lines.join('\n');
}

/**
 * Sanitize filename to remove invalid characters
 */
function sanitizeFilename(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

/**
 * Show download options (PDF and TXT)
 */
export const showDownloadOptions = (recipe: ExtendedRecipe) => {
    // For now, directly trigger both downloads separately via buttons
    // This function can be expanded for a modal if needed
};
