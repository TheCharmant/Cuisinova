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
 * Helper to load image and return HTMLImageElement with natural dimensions
 */
const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};

/**
 * Download recipe as PDF file (print-style layout)
 */
export const downloadRecipeAsPDF = async (recipe: ExtendedRecipe) => {
    try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const maxWidth = pageWidth - margin * 2;
        let y = margin;

        // --- Recipe Image ---
        if (recipe.imgLink) {
            try {
                const img = await loadImage(recipe.imgLink);
                const naturalWidth = img.width;
                const naturalHeight = img.height;
                const imgWidth = maxWidth;
                const imgHeight = (naturalHeight / naturalWidth) * imgWidth;

                if (y + imgHeight > 280) {
                    doc.addPage();
                    y = margin;
                }
                doc.addImage(img, 'JPEG', margin, y, imgWidth, imgHeight);
                y += imgHeight + 10;
            } catch (err) {
                console.warn('Failed to load image for PDF, skipping.', err);
            }
        }

        // --- Title ---
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        const titleLines = doc.splitTextToSize(recipe.name, maxWidth);
        doc.text(titleLines, pageWidth / 2, y, { align: 'center' });
        y += titleLines.length * 10 + 5;

        // --- Owner & Date ---
        if (recipe.owner?.name) {
            if (y > 270) {
                doc.addPage();
                y = margin;
            }
            doc.setFontSize(11);
            doc.setFont('helvetica', 'italic');
            const dateStr = recipe.createdAt ? new Date(recipe.createdAt).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric'
            }) : '';
            const ownerLine = `By ${recipe.owner.name}${dateStr ? ' on ' + dateStr : ''}`;
            doc.text(ownerLine, margin, y);
            y += 8;
        }

        // --- Dietary Preferences ---
        if (recipe.dietaryPreference && recipe.dietaryPreference.length > 0) {
            if (y > 260) {
                doc.addPage();
                y = margin;
            }
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Dietary Preferences:', margin, y);
            y += 6;
            doc.setFont('helvetica', 'normal');
            const dietLine = recipe.dietaryPreference.join(', ');
            const dietLines = doc.splitTextToSize(dietLine, maxWidth);
            doc.text(dietLines, margin, y);
            y += dietLines.length * 7 + 8;
        }

        // --- Ingredients ---
        if (y > 240) {
            doc.addPage();
            y = margin;
        }
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

        // --- Instructions ---
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

        // --- Additional Information ---
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
    } catch (error) {
        console.error('Error generating PDF:', error);
    }
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
